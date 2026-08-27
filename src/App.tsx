/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings,
  Minimize2,
  Maximize2,
  ListTodo,
  StickyNote as StickyNoteIcon,
  Timer as TimerIcon,
  Sparkles,
  RefreshCw,
  Award,
  CheckCircle2,
  Download,
  ExternalLink,
} from 'lucide-react';

import {
  PandaMood,
  PomodoroPhase,
  StickyNote,
  SubTask,
  TimerMode,
  TimerSettings,
} from './types';
import { PandaMascot } from './components/PandaMascot';
import { PandaLogo } from './components/PandaLogo';
import { PomoTimer } from './components/PomoTimer';
import { SubtaskTracker } from './components/SubtaskTracker';
import { StickyNotes } from './components/StickyNotes';
import { MiniWidget } from './components/MiniWidget';
import { SettingsModal } from './components/SettingsModal';
import { DownloadModal } from './components/DownloadModal';
import { playBambooClick, playChime, playTaskCheer } from './utils/audio';
import { formatTime } from './utils/time';

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  soundEnabled: true,
  volume: 0.65,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  theme: 'matcha',
};

// Initial preset matching user request (3 hrs goal: 1h A, 1.5h B, 30m C)
const INITIAL_SUBTASKS: SubTask[] = [
  {
    id: 'subtask-1',
    title: 'Subject A - Deep Conceptual Study',
    targetSeconds: 3600, // 1 hour
    elapsedSeconds: 0,
    completed: false,
    colorTag: 'emerald',
  },
  {
    id: 'subtask-2',
    title: 'Subject B - Problem Sets & Practice',
    targetSeconds: 5400, // 1.5 hours
    elapsedSeconds: 0,
    completed: false,
    colorTag: 'amber',
  },
  {
    id: 'subtask-3',
    title: 'Subject C - Flashcards & Summary Revision',
    targetSeconds: 1800, // 30 minutes
    elapsedSeconds: 0,
    completed: false,
    colorTag: 'teal',
  },
];

const INITIAL_NOTES: StickyNote[] = [
  {
    id: 'note-1',
    title: 'Study Session Checklist',
    content: '',
    color: 'matcha',
    pinned: true,
    isChecklist: true,
    items: [
      { id: 'i-1', text: 'Solve Physics Exercise 1 to 5', done: false },
      { id: 'i-2', text: 'Outline Key Chemistry formulas', done: false },
      { id: 'i-3', text: 'Review Flashcards for 15 mins', done: false },
    ],
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: 'note-2',
    title: 'Focus Reminders & Tips',
    content: '• Put phone on Do Not Disturb 📴\n• Keep water bottle handy 💧\n• Take standing stretch on every short break 🎋',
    color: 'creamy',
    pinned: false,
    isChecklist: false,
    items: [],
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 7200000,
  },
];

export default function App() {
  // Local storage loading
  const [settings, setSettings] = useState<TimerSettings>(() => {
    try {
      const saved = localStorage.getItem('pomo_panda_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [subtasks, setSubtasks] = useState<SubTask[]>(() => {
    try {
      const saved = localStorage.getItem('pomo_panda_subtasks');
      return saved ? JSON.parse(saved) : INITIAL_SUBTASKS;
    } catch {
      return INITIAL_SUBTASKS;
    }
  });

  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>(() => {
    try {
      const saved = localStorage.getItem('pomo_panda_notes');
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  // Active tracking state
  const [activeTaskId, setActiveTaskId] = useState<string | null>(() => {
    return subtasks.length > 0 ? subtasks[0].id : null;
  });

  // Timer state
  const [timerMode, setTimerMode] = useState<TimerMode>('pomodoro');
  const [phase, setPhase] = useState<PomodoroPhase>('work');
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  // Time counters
  const [remainingSeconds, setRemainingSeconds] = useState(settings.workDuration * 60);
  const [totalDurationSeconds, setTotalDurationSeconds] = useState(settings.workDuration * 60);
  const [stopwatchElapsedSeconds, setStopwatchElapsedSeconds] = useState(0);

  // UI view state
  const [viewMode, setViewMode] = useState<'full' | 'mini' | 'zen'>('full');
  const [mobileTab, setMobileTab] = useState<'timer' | 'tasks' | 'notes'>('timer');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [celebrationToast, setCelebrationToast] = useState<string | null>(null);

  // Mascot dynamic speech & mood
  const [customSpeech, setCustomSpeech] = useState<string | undefined>(undefined);

  // References for drift-free timer
  const lastTickRef = useRef<number>(Date.now());
  const completedNoticeSent = useRef<Record<string, boolean>>({});

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('pomo_panda_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('pomo_panda_subtasks', JSON.stringify(subtasks));
  }, [subtasks]);

  useEffect(() => {
    localStorage.setItem('pomo_panda_notes', JSON.stringify(stickyNotes));
  }, [stickyNotes]);

  // Compute Panda Mood
  const getPandaMood = (): PandaMood => {
    if (celebrationToast) return 'celebrating';
    if (!isRunning) return 'happy';
    if (timerMode === 'stopwatch') return 'focus';
    if (phase === 'work') return 'focus';
    if (phase === 'shortBreak') return 'break';
    return 'sleeping';
  };

  // Phase duration lookup
  const getPhaseDuration = useCallback((p: PomodoroPhase, currentSettings: TimerSettings) => {
    switch (p) {
      case 'work':
        return currentSettings.workDuration * 60;
      case 'shortBreak':
        return currentSettings.shortBreakDuration * 60;
      case 'longBreak':
        return currentSettings.longBreakDuration * 60;
    }
  }, []);

  // Update duration when phase or settings change
  const handlePhaseChange = useCallback((newPhase: PomodoroPhase) => {
    setPhase(newPhase);
    const duration = getPhaseDuration(newPhase, settings);
    setTotalDurationSeconds(duration);
    setRemainingSeconds(duration);
  }, [getPhaseDuration, settings]);

  // Next phase trigger
  const handleNextPhase = useCallback(() => {
    if (phase === 'work') {
      const nextCount = pomodoroCount + 1;
      setPomodoroCount(nextCount);
      const isLong = nextCount % settings.longBreakInterval === 0;
      const nextPhase: PomodoroPhase = isLong ? 'longBreak' : 'shortBreak';
      handlePhaseChange(nextPhase);

      if (settings.soundEnabled) playChime(settings.volume);
      setCustomSpeech(isLong ? 'Amazing focus! Enjoy your long break 🎋' : 'Great work! Take a 5-min tea break 🍵');
      setTimeout(() => setCustomSpeech(undefined), 6000);

      if (!settings.autoStartBreaks) {
        setIsRunning(false);
      }
    } else {
      // Break ended, switch to work
      handlePhaseChange('work');
      if (settings.soundEnabled) playChime(settings.volume);
      setCustomSpeech('Break over! Let’s crush the next study session 🐼');
      setTimeout(() => setCustomSpeech(undefined), 6000);

      if (!settings.autoStartPomodoros) {
        setIsRunning(false);
      }
    }
  }, [phase, pomodoroCount, settings, handlePhaseChange]);

  // Main Timer Interval Loop with Subtask Tracking
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      lastTickRef.current = Date.now();

      interval = setInterval(() => {
        const now = Date.now();
        const delta = Math.round((now - lastTickRef.current) / 1000);

        if (delta >= 1) {
          lastTickRef.current = now;

          // 1. Advance Stopwatch
          if (timerMode === 'stopwatch') {
            setStopwatchElapsedSeconds((prev) => prev + delta);
          }

          // 2. Advance Pomodoro / Countdown
          if (timerMode === 'pomodoro' || timerMode === 'countdown') {
            setRemainingSeconds((prev) => {
              if (prev <= delta) {
                // Interval finished
                setTimeout(() => handleNextPhase(), 0);
                return 0;
              }
              return prev - delta;
            });
          }

          // 3. Increment Active Subtask real-time elapsed time (during focus/work/stopwatch)
          if ((timerMode === 'stopwatch' || (timerMode === 'pomodoro' && phase === 'work')) && activeTaskId) {
            setSubtasks((prevTasks) =>
              prevTasks.map((t) => {
                if (t.id === activeTaskId) {
                  const newElapsed = t.elapsedSeconds + delta;

                  // Check if just reached target
                  if (newElapsed >= t.targetSeconds && !completedNoticeSent.current[t.id]) {
                    completedNoticeSent.current[t.id] = true;
                    if (settings.soundEnabled) playTaskCheer(settings.volume);
                    setCelebrationToast(`🎉 Target reached for "${t.title}"!`);
                    setTimeout(() => setCelebrationToast(null), 5000);
                  }

                  return {
                    ...t,
                    elapsedSeconds: newElapsed,
                    completed: newElapsed >= t.targetSeconds ? true : t.completed,
                  };
                }
                return t;
              })
            );
          }
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timerMode, phase, activeTaskId, handleNextPhase, settings]);

  // Dynamic Browser Tab Title
  useEffect(() => {
    const timeStr = timerMode === 'stopwatch'
      ? formatTime(stopwatchElapsedSeconds)
      : formatTime(remainingSeconds);

    const activeTask = subtasks.find((t) => t.id === activeTaskId);
    const taskName = activeTask ? activeTask.title : 'Study';
    const phaseLabel = timerMode === 'stopwatch' ? 'Continuous' : phase === 'work' ? 'Focus' : 'Break';

    document.title = isRunning
      ? `[${timeStr}] ${phaseLabel} • ${taskName} - goPanda`
      : `goPanda • Focus Timer`;
  }, [isRunning, timerMode, phase, remainingSeconds, stopwatchElapsedSeconds, activeTaskId, subtasks]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase() || '')) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning((prev) => !prev);
        if (settings.soundEnabled) playBambooClick(0.3);
      } else if (e.key.toLowerCase() === 'r') {
        handleResetTimer();
      } else if (e.key.toLowerCase() === 's' && timerMode === 'pomodoro') {
        handleNextPhase();
      } else if (e.key.toLowerCase() === 'm') {
        setViewMode((prev) => (prev === 'mini' ? 'full' : 'mini'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [timerMode, handleNextPhase, settings.soundEnabled]);

  // Timer Control Handlers
  const handleTogglePlayPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    if (timerMode === 'stopwatch') {
      setStopwatchElapsedSeconds(0);
    } else {
      const duration = getPhaseDuration(phase, settings);
      setRemainingSeconds(duration);
      setTotalDurationSeconds(duration);
    }
  };

  const handleAddMinutes = (mins: number) => {
    const addSec = mins * 60;
    if (timerMode === 'stopwatch') {
      setStopwatchElapsedSeconds((prev) => Math.max(0, prev + addSec));
    } else {
      setRemainingSeconds((prev) => prev + addSec);
      setTotalDurationSeconds((prev) => prev + addSec);
    }
  };

  const handleSelectMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setTimerMode(newMode);
    if (newMode === 'pomodoro') {
      const duration = getPhaseDuration(phase, settings);
      setTotalDurationSeconds(duration);
      setRemainingSeconds(duration);
    }
  };

  // Subtask Handlers
  const handleAddTask = (newTask: Omit<SubTask, 'id' | 'elapsedSeconds' | 'completed'>) => {
    const task: SubTask = {
      ...newTask,
      id: 'task-' + Math.random().toString(36).substring(2, 9),
      elapsedSeconds: 0,
      completed: false,
    };
    setSubtasks((prev) => [...prev, task]);
    if (!activeTaskId) {
      setActiveTaskId(task.id);
    }
  };

  const handleUpdateTask = (updatedTask: SubTask) => {
    setSubtasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleDeleteTask = (taskId: string) => {
    setSubtasks((prev) => prev.filter((t) => t.id !== taskId));
    if (activeTaskId === taskId) {
      const remaining = subtasks.filter((t) => t.id !== taskId);
      setActiveTaskId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleToggleComplete = (taskId: string) => {
    setSubtasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            setCelebrationToast(`🌟 Task completed: ${t.title}`);
            setTimeout(() => setCelebrationToast(null), 4000);
          }
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  // Sticky Note Handlers
  const handleAddNote = (newNote: Omit<StickyNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const note: StickyNote = {
      ...newNote,
      id: 'note-' + Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setStickyNotes((prev) => [note, ...prev]);
  };

  const handleUpdateNote = (updatedNote: StickyNote) => {
    setStickyNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
  };

  const handleDeleteNote = (noteId: string) => {
    setStickyNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset subtasks and notes to default 3-hour study sample?')) {
      setSubtasks(INITIAL_SUBTASKS);
      setActiveTaskId('subtask-1');
      setStickyNotes(INITIAL_NOTES);
      setPomodoroCount(0);
      handleResetTimer();
    }
  };

  const handleToggleFloatingWidget = async () => {
    if (settings.soundEnabled) playBambooClick(0.2);
    if (viewMode === 'mini') {
      setViewMode('full');
    } else {
      setViewMode('mini');
      // If PiP is supported, also launch the on-top floating window
      if ('documentPictureInPicture' in window) {
        handleLaunchAlwaysOnTop();
      }
    }
  };

  const handleLaunchAlwaysOnTop = async () => {
    if (settings.soundEnabled) playBambooClick(0.2);
    if ('documentPictureInPicture' in window) {
      try {
        const pipWindow = await (window as any).documentPictureInPicture.requestWindow({
          width: 280,
          height: 280,
        });

        document.querySelectorAll('style, link[rel="stylesheet"]').forEach((el) => {
          pipWindow.document.head.appendChild(el.cloneNode(true));
        });

        const updatePiP = () => {
          const formattedCurrentTime = formatTime(
            timerMode === 'stopwatch' ? stopwatchElapsedSeconds : remainingSeconds
          );
          const currentProgress =
            timerMode === 'stopwatch'
              ? Math.min(100, Math.round(((stopwatchElapsedSeconds % 1500) / 1500) * 100))
              : totalDurationSeconds > 0
              ? Math.min(
                  100,
                  Math.max(
                    0,
                    Math.round(
                      ((totalDurationSeconds - remainingSeconds) / totalDurationSeconds) * 100
                    )
                  )
                )
              : 0;

          pipWindow.document.body.style.margin = '0';
          pipWindow.document.body.style.background = '#FAF9F6';
          pipWindow.document.body.style.fontFamily = 'system-ui, -apple-system, sans-serif';
          pipWindow.document.body.style.userSelect = 'none';

          pipWindow.document.body.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; padding:16px; box-sizing:border-box; text-align:center;">
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:8px;">
                <span style="font-weight:900; font-size:14px; color:#1C1917;">goPanda</span>
                <span style="font-size:10px; font-weight:800; background:#86EFAC; border:1.5px solid #000; padding:1px 6px; border-radius:6px; color:#000;">
                  ${phase === 'work' ? 'Focus' : 'Break'} (${currentProgress}%)
                </span>
              </div>
              <div style="font-size:36px; font-family:monospace; font-weight:900; color:#15803D; line-height:1; margin-bottom:6px;">
                ${formattedCurrentTime}
              </div>
              <div style="font-size:11px; font-weight:700; color:#44403C; margin-bottom:10px; max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                ${activeTask ? activeTask.title : 'Focus Session'}
              </div>
              <div style="width:100%; height:8px; background:#E5E7EB; border:1.5px solid #000; border-radius:999px; overflow:hidden; margin-bottom:12px;">
                <div style="width:${currentProgress}%; height:100%; background:#22C55E; border-radius:999px;"></div>
              </div>
              <div style="display:flex; gap:8px;">
                <button id="pip-toggle" style="background:${isRunning ? '#FEF08A' : '#4ADE80'}; font-weight:900; font-size:12px; border:2px solid #000; border-radius:10px; padding:6px 14px; cursor:pointer; box-shadow:2px 2px 0 #000;">
                  ${isRunning ? 'Pause' : 'Start'}
                </button>
                <button id="pip-skip" style="background:#FFFFFF; font-weight:900; font-size:12px; border:2px solid #000; border-radius:10px; padding:6px 10px; cursor:pointer; box-shadow:2px 2px 0 #000;">
                  Skip
                </button>
              </div>
            </div>
          `;

          const toggleBtn = pipWindow.document.getElementById('pip-toggle');
          if (toggleBtn) toggleBtn.onclick = () => handleTogglePlayPause();
          const skipBtn = pipWindow.document.getElementById('pip-skip');
          if (skipBtn) skipBtn.onclick = () => handleNextPhase();
        };

        updatePiP();
        const intervalId = setInterval(updatePiP, 1000);
        pipWindow.addEventListener('pagehide', () => clearInterval(intervalId));
      } catch (err) {
        console.warn('PiP window request failed', err);
      }
    }
  };

  const activeTask = subtasks.find((t) => t.id === activeTaskId) || null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-3 sm:p-5 md:p-6" id="pomo-panda-app">
      {/* Top Navigation Header */}
      <header className="w-full max-w-7xl flex items-center justify-between bg-white px-5 py-3 rounded-[24px] border-2 border-black shadow-[4px_4px_0px_0px_#000] mb-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
            <PandaLogo size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-stone-950 tracking-tight text-base sm:text-lg leading-tight">
                goPanda
              </h1>
              <span className="px-2.5 py-0.5 bg-emerald-300 border border-black text-stone-950 text-[10px] font-black rounded-md shadow-[1px_1px_0px_0px_#000]">
                Focus Timer
              </span>
            </div>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2">
          {/* Install Desktop / Mobile App Button */}
          <button
            id="btn-open-downloads"
            onClick={() => {
              setIsDownloadModalOpen(true);
              if (settings.soundEnabled) playBambooClick(0.2);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border-2 border-black bg-emerald-400 hover:bg-emerald-500 text-stone-950 transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            title="Install goPanda on Desktop or Mobile"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Install App</span>
          </button>

          {/* Reset All Sample Data */}
          <button
            onClick={handleResetDefaults}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-900 font-bold hover:bg-stone-100 rounded-xl border border-stone-300 transition-colors"
            title="Reset to 3-hour sample session"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          {/* Floating Widget (Always on Top) */}
          <button
            id="btn-toggle-floating-widget"
            onClick={handleToggleFloatingWidget}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black border-2 border-black transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
              viewMode === 'mini'
                ? 'bg-emerald-400 text-stone-950'
                : 'bg-sky-200 hover:bg-sky-300 text-stone-950'
            }`}
            title="Launch floating panda widget on top of all apps, desktop and tabs"
          >
            {viewMode === 'mini' ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">Full Workspace</span>
              </>
            ) : (
              <>
                <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">Floating Widget</span>
              </>
            )}
          </button>

          {/* Settings Modal Toggle */}
          <button
            id="btn-open-settings"
            onClick={() => {
              setIsSettingsOpen(true);
              if (settings.soundEnabled) playBambooClick(0.2);
            }}
            className="p-2 text-stone-950 hover:bg-stone-100 rounded-xl border-2 border-black transition-all bg-white shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            title="Timer and audio settings"
          >
            <Settings className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Celebration Notification Banner */}
      <AnimatePresence>
        {celebrationToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md mx-auto mb-3 bg-[#FEF08A] text-stone-950 border-2 border-black px-4 py-2.5 rounded-2xl shadow-[4px_4px_0px_0px_#000] flex items-center justify-between text-xs font-black z-30"
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-800" />
              <span>{celebrationToast}</span>
            </div>
            <button
              onClick={() => setCelebrationToast(null)}
              className="text-stone-900 hover:text-black text-sm px-1.5 font-black"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl flex-1 flex flex-col justify-center">
        {viewMode === 'mini' ? (
          /* Mini Widget View Mode with background overlay */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-white p-6 sm:p-8 rounded-[24px] border-2 border-black shadow-[6px_6px_0px_0px_#000] max-w-sm">
              <PandaMascot
                mood={getPandaMood()}
                size="lg"
                speechText="Mini widget active on screen corner!"
                isTimerRunning={isRunning}
              />
              <p className="text-xs text-stone-600 font-medium mt-3 mb-4">
                goPanda is floating in compact mode. Drag it anywhere or click to expand!
              </p>
              <button
                onClick={() => setViewMode('full')}
                className="px-4 py-2 bg-emerald-400 hover:bg-emerald-500 text-stone-950 rounded-xl text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all"
              >
                Return to Full Workspace
              </button>
            </div>

            {/* Floating Mini Widget */}
            <MiniWidget
              mode={timerMode}
              phase={phase}
              remainingSeconds={remainingSeconds}
              totalDurationSeconds={totalDurationSeconds}
              stopwatchElapsedSeconds={stopwatchElapsedSeconds}
              isRunning={isRunning}
              activeTask={activeTask}
              mood={getPandaMood()}
              soundEnabled={settings.soundEnabled}
              onTogglePlayPause={handleTogglePlayPause}
              onSkipPhase={handleNextPhase}
              onExpand={() => setViewMode('full')}
              bubbleNotification={customSpeech || celebrationToast}
            />
          </div>
        ) : (
          /* Full Studio Workspace */
          <div className="w-full">
            {/* Mobile Tab Switcher */}
            <div className="flex lg:hidden items-center justify-center gap-1.5 mb-3 bg-white p-1.5 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <button
                onClick={() => setMobileTab('timer')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  mobileTab === 'timer' ? 'bg-emerald-400 text-stone-950 border border-black shadow-[1px_1px_0px_0px_#000]' : 'text-stone-700'
                }`}
              >
                <TimerIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Timer & Panda</span>
              </button>
              <button
                onClick={() => setMobileTab('tasks')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  mobileTab === 'tasks' ? 'bg-emerald-400 text-stone-950 border border-black shadow-[1px_1px_0px_0px_#000]' : 'text-stone-700'
                }`}
              >
                <ListTodo className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Subtasks ({subtasks.length})</span>
              </button>
              <button
                onClick={() => setMobileTab('notes')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  mobileTab === 'notes' ? 'bg-emerald-400 text-stone-950 border border-black shadow-[1px_1px_0px_0px_#000]' : 'text-stone-700'
                }`}
              >
                <StickyNoteIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Sticky Notes</span>
              </button>
            </div>

            {/* 3-Column Responsive Grid on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              {/* Center / Primary Column: Timer & Cute Animated Mascot (5 Cols) */}
              <div
                className={`lg:col-span-5 flex flex-col gap-3.5 ${
                  mobileTab === 'timer' ? 'block' : 'hidden lg:flex'
                }`}
              >
                {/* Cute Panda Mascot Box */}
                <div className="bg-white rounded-[24px] border-2 border-black shadow-[4px_4px_0px_0px_#000] p-3.5 flex flex-col items-center justify-center relative overflow-hidden">
                  <PandaMascot
                    mood={getPandaMood()}
                    size="md"
                    speechText={customSpeech}
                    isTimerRunning={isRunning}
                    onPandaClick={() => {
                      if (activeTask) {
                        setCustomSpeech(`Cheering you on for ${activeTask.title}! 🎋`);
                      } else {
                        setCustomSpeech('Pick a study goal to track! 🐾');
                      }
                      setTimeout(() => setCustomSpeech(undefined), 4000);
                    }}
                  />
                </div>

                {/* Main Pomodoro & Continuous Timer Component */}
                <div className="flex-1 min-h-[380px]">
                  <PomoTimer
                    mode={timerMode}
                    phase={phase}
                    remainingSeconds={remainingSeconds}
                    totalDurationSeconds={totalDurationSeconds}
                    stopwatchElapsedSeconds={stopwatchElapsedSeconds}
                    isRunning={isRunning}
                    pomodoroCount={pomodoroCount}
                    longBreakInterval={settings.longBreakInterval}
                    activeTask={activeTask}
                    soundEnabled={settings.soundEnabled}
                    onTogglePlayPause={handleTogglePlayPause}
                    onReset={handleResetTimer}
                    onSkipPhase={handleNextPhase}
                    onAddMinutes={handleAddMinutes}
                    onSelectMode={handleSelectMode}
                    onSelectPhase={handlePhaseChange}
                    onToggleSound={() =>
                      setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
                    }
                  />
                </div>
              </div>

              {/* Subtasks Tracker Column (4 Cols) */}
              <div
                className={`lg:col-span-4 h-[560px] lg:h-auto ${
                  mobileTab === 'tasks' ? 'block' : 'hidden lg:block'
                }`}
              >
                <SubtaskTracker
                  tasks={subtasks}
                  activeTaskId={activeTaskId}
                  isTimerRunning={isRunning}
                  onSelectTask={(id) => setActiveTaskId(id)}
                  onAddTask={handleAddTask}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                  onToggleComplete={handleToggleComplete}
                  soundEnabled={settings.soundEnabled}
                />
              </div>

              {/* Sticky Notes & Checklist Column (3 Cols) */}
              <div
                className={`lg:col-span-3 h-[560px] lg:h-auto ${
                  mobileTab === 'notes' ? 'block' : 'hidden lg:block'
                }`}
              >
                <StickyNotes
                  notes={stickyNotes}
                  onAddNote={handleAddNote}
                  onUpdateNote={handleUpdateNote}
                  onDeleteNote={handleDeleteNote}
                  soundEnabled={settings.soundEnabled}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Info Bar */}
      <footer className="w-full max-w-7xl mt-4 pt-3 border-t-2 border-black/10 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-700 font-bold gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <PandaLogo size={18} />
            <span><strong>goPanda</strong> v1.0.0</span>
          </div>
          <span>•</span>
          <span className="hidden sm:inline">Shortcuts: <strong>Space</strong> (play/pause), <strong>R</strong> (reset), <strong>S</strong> (skip), <strong>M</strong> (mini)</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="text-stone-900 underline hover:text-emerald-700 transition-colors"
          >
            Install Desktop App & Shortcuts
          </button>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black" />
        </div>
      </footer>

      {/* Download & GitHub Deploy Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        soundEnabled={settings.soundEnabled}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onSaveSettings={(newSettings) => {
          setSettings(newSettings);
          // If not running, adjust timer remaining to match new work duration
          if (!isRunning && timerMode === 'pomodoro') {
            const newDuration = getPhaseDuration(phase, newSettings);
            setTotalDurationSeconds(newDuration);
            setRemainingSeconds(newDuration);
          }
        }}
      />
    </div>
  );
}
