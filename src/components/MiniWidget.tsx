import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Maximize2,
  SkipForward,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Move,
} from 'lucide-react';
import { PandaMood, PomodoroPhase, SubTask, TimerMode } from '../types';
import { PandaLogo } from './PandaLogo';
import { formatHumanDuration, formatTime } from '../utils/time';
import { playBambooClick } from '../utils/audio';

interface MiniWidgetProps {
  mode: TimerMode;
  phase: PomodoroPhase;
  remainingSeconds: number;
  totalDurationSeconds: number;
  stopwatchElapsedSeconds: number;
  isRunning: boolean;
  activeTask: SubTask | null;
  mood: PandaMood;
  soundEnabled: boolean;
  onTogglePlayPause: () => void;
  onSkipPhase: () => void;
  onExpand: () => void;
  bubbleNotification?: string | null;
}

export const MiniWidget: React.FC<MiniWidgetProps> = ({
  mode,
  phase,
  remainingSeconds,
  totalDurationSeconds,
  stopwatchElapsedSeconds,
  isRunning,
  activeTask,
  soundEnabled,
  onTogglePlayPause,
  onSkipPhase,
  onExpand,
  bubbleNotification,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localBubble, setLocalBubble] = useState<string | null>(null);
  const prevRemainingRef = useRef<number>(remainingSeconds);
  const lastBubbleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Time & Progress calculations
  const displayTime =
    mode === 'stopwatch'
      ? formatTime(stopwatchElapsedSeconds)
      : formatTime(remainingSeconds);

  // Overall session percentage (0 - 100)
  const sessionProgress =
    mode === 'stopwatch'
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

  // Subtask progress
  const taskProgress =
    activeTask && activeTask.targetSeconds > 0
      ? Math.min(
          100,
          Math.round((activeTask.elapsedSeconds / activeTask.targetSeconds) * 100)
        )
      : 0;

  // Automatic gentle Panda pop-ups at key milestones (10m, halfway, 5m, 1m)
  useEffect(() => {
    if (bubbleNotification) {
      setLocalBubble(bubbleNotification);
      if (lastBubbleTimerRef.current) clearTimeout(lastBubbleTimerRef.current);
      lastBubbleTimerRef.current = setTimeout(() => setLocalBubble(null), 5000);
      return;
    }

    if (!isRunning || mode !== 'pomodoro' || phase !== 'work') return;

    const prev = prevRemainingRef.current;
    const curr = remainingSeconds;
    prevRemainingRef.current = curr;

    // 10 mins remaining
    if (prev > 600 && curr <= 600 && curr > 590) {
      triggerBubble('10 mins left, yayy! You got this! 🎋');
    }
    // Halfway mark
    else if (
      totalDurationSeconds > 0 &&
      prev > totalDurationSeconds / 2 &&
      curr <= totalDurationSeconds / 2
    ) {
      triggerBubble('Halfway there! Keep going super focused! 🌟');
    }
    // 5 mins remaining
    else if (prev > 300 && curr <= 300 && curr > 290) {
      triggerBubble('Almost there, 5 mins remaining! 🚀');
    }
    // 1 min remaining
    else if (prev > 60 && curr <= 60 && curr > 50) {
      triggerBubble('Final 60 seconds stretch! 🎯');
    }
  }, [remainingSeconds, isRunning, mode, phase, totalDurationSeconds, bubbleNotification]);

  const triggerBubble = (text: string) => {
    setLocalBubble(text);
    if (lastBubbleTimerRef.current) clearTimeout(lastBubbleTimerRef.current);
    lastBubbleTimerRef.current = setTimeout(() => setLocalBubble(null), 5000);
  };

  const handlePandaClick = () => {
    if (soundEnabled) playBambooClick(0.2);
    setIsExpanded((prev) => !prev);
    // If not showing bubble, show friendly quick status
    if (!localBubble && !isExpanded) {
      if (isRunning) {
        triggerBubble(`${sessionProgress}% done • ${displayTime} remaining!`);
      } else {
        triggerBubble('Panda is ready! Click play to start 🐼');
      }
    }
  };

  // Picture-in-Picture Always-On-Top popup handler (Chrome / Edge / Brave Document PiP)
  const handlePopOutPiP = async () => {
    if (soundEnabled) playBambooClick(0.2);
    if ('documentPictureInPicture' in window) {
      try {
        const pipWindow = await (window as any).documentPictureInPicture.requestWindow({
          width: 320,
          height: 180,
        });

        // Copy styles
        document.querySelectorAll('style, link[rel="stylesheet"]').forEach((el) => {
          pipWindow.document.head.appendChild(el.cloneNode(true));
        });

        pipWindow.document.body.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; background:#FAF9F6; font-family:sans-serif; margin:0; padding:12px; box-sizing:border-box;">
            <div style="font-weight:900; font-size:18px; color:#1C1917; margin-bottom:4px;">goPanda</div>
            <div style="font-size:28px; font-family:monospace; font-weight:900; color:#15803D;">${displayTime}</div>
            <div style="font-size:12px; font-weight:bold; color:#44403C; margin-top:4px;">${activeTask ? activeTask.title : (phase === 'work' ? 'Focus Session' : 'Break')} (${sessionProgress}%)</div>
            <div style="margin-top:8px; width:100%; height:6px; background:#E5E7EB; border-radius:999px; overflow:hidden;">
              <div style="width:${sessionProgress}%; height:100%; background:#22C55E; border-radius:999px;"></div>
            </div>
          </div>
        `;
      } catch (err) {
        console.warn('PiP window request failed', err);
      }
    } else {
      triggerBubble('Drag me anywhere on your screen! 🐼');
    }
  };

  // Circular progress ring math for 64px diameter button
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (sessionProgress / 100) * circumference;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      initial={{ scale: 0.9, opacity: 0, x: 0, y: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="fixed bottom-6 right-6 z-50 select-none touch-none"
      id="gopanda-movable-mini-widget"
    >
      {/* Panda Speech Bubble Popup */}
      <AnimatePresence>
        {localBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="absolute bottom-full right-0 mb-3 w-64 bg-[#FEF08A] text-stone-950 px-3.5 py-2.5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_#000] text-xs font-black flex items-start justify-between gap-2 z-50 pointer-events-auto"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-900 shrink-0" />
              <span className="leading-snug">{localBubble}</span>
            </div>
            <button
              onClick={() => setLocalBubble(null)}
              className="text-stone-700 hover:text-black font-black text-xs px-1"
            >
              ✕
            </button>
            {/* Speech bubble pointer */}
            <div className="absolute -bottom-2 right-8 w-3 h-3 bg-[#FEF08A] border-r-2 border-b-2 border-black rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Control Box */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            className="absolute bottom-full right-0 mb-3 w-76 sm:w-80 bg-white rounded-[24px] border-2 border-black shadow-[6px_6px_0px_0px_#000] p-4 text-stone-950 z-40 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b-2 border-stone-100 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black animate-pulse" />
                <span className="font-black text-xs text-stone-950">goPanda</span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-300 border border-black text-stone-950 font-black rounded-md shadow-[1px_1px_0px_0px_#000]">
                  {mode === 'stopwatch' ? 'Stopwatch' : phase === 'work' ? 'Focus' : 'Break'}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {/* Always-On-Top PiP Window if supported */}
                {'documentPictureInPicture' in window && (
                  <button
                    onClick={handlePopOutPiP}
                    className="p-1 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-lg border border-black/10 transition-colors"
                    title="Pop out Always-On-Top Floating Window"
                  >
                    <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                )}

                <button
                  onClick={() => {
                    onExpand();
                    if (soundEnabled) playBambooClick(0.2);
                  }}
                  className="p-1 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg border border-black/10 transition-colors"
                  title="Expand to Full Workspace"
                >
                  <Maximize2 className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Timer & Progress */}
            <div className="flex items-center justify-between my-2">
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-stone-950 leading-none tracking-tight">
                  {displayTime}
                </div>
                <div className="text-[11px] font-bold text-stone-600 mt-0.5">
                  {mode === 'stopwatch'
                    ? 'Continuous focus active'
                    : `${sessionProgress}% completed (${formatHumanDuration(remainingSeconds)} left)`}
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-100 px-2 py-1 rounded-xl border border-emerald-400">
                <span>{sessionProgress}%</span>
              </div>
            </div>

            {/* Session Green Progress Bar */}
            <div className="h-2 w-full bg-stone-100 border border-black rounded-full overflow-hidden my-2">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-300 shadow-[inset_0px_1px_2px_rgba(0,0,0,0.2)]"
                style={{ width: `${sessionProgress}%` }}
              />
            </div>

            {/* Active Subtask Info */}
            <div className="p-2 bg-stone-50 border border-black/10 rounded-xl mb-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-stone-700 truncate">
                <span className="truncate text-stone-900">
                  {activeTask ? activeTask.title : 'No active subtask selected'}
                </span>
                {activeTask && (
                  <span className="text-emerald-700 font-mono text-[10px] shrink-0 ml-1">
                    {taskProgress}%
                  </span>
                )}
              </div>
              {activeTask && (
                <div className="mt-1 h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${taskProgress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between pt-1 border-t border-stone-100">
              <span className="text-[10px] text-stone-500 font-bold flex items-center gap-1">
                <Move className="w-3 h-3 text-stone-400" />
                <span>Drag to move anywhere</span>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    onTogglePlayPause();
                    if (soundEnabled) playBambooClick(0.3);
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black text-stone-950 border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all ${
                    isRunning
                      ? 'bg-[#FEF08A] hover:bg-[#FDE047]'
                      : 'bg-emerald-400 hover:bg-emerald-500'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-3 h-3 fill-current" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      <span>Start</span>
                    </>
                  )}
                </button>

                {mode === 'pomodoro' && (
                  <button
                    onClick={() => {
                      onSkipPhase();
                      if (soundEnabled) playBambooClick(0.2);
                    }}
                    className="p-1.5 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-xl border-2 border-black transition-colors shadow-[1px_1px_0px_0px_#000]"
                    title="Skip Phase"
                  >
                    <SkipForward className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Floating Panda Mascot Badge with Circular Green Progress Ring */}
      <div className="relative flex items-center justify-center group cursor-grab active:cursor-grabbing">
        {/* SVG Circular Green Progress Meter Ring */}
        <svg
          className="w-18 h-18 -rotate-90 transform drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]"
          viewBox="0 0 64 64"
        >
          {/* Background track circle */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="5"
            fill="#FAF9F6"
          />
          {/* Border ring outline */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="#000000"
            strokeWidth="5.5"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset="0"
          />
          {/* Active Green Progress Arc */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="#22C55E"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center Panda Mascot Button */}
        <button
          onClick={handlePandaClick}
          className="absolute inset-1.5 rounded-full bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform overflow-hidden shadow-inner"
          title={`goPanda: ${sessionProgress}% completed (${displayTime}) • Click to expand`}
        >
          <div className="w-10 h-10 flex items-center justify-center">
            <PandaLogo size={36} />
          </div>

          {/* Glowing dot indicator when timer is active */}
          {isRunning && (
            <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black animate-ping" />
          )}
        </button>

        {/* Floating Mini Expand / Minimize Chevron Tooltip */}
        <div
          onClick={handlePandaClick}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white border border-black flex items-center justify-center text-stone-900 shadow-[1px_1px_0px_0px_#000] cursor-pointer hover:bg-stone-100"
          title={isExpanded ? 'Collapse box' : 'Expand widget details'}
        >
          {isExpanded ? (
            <ChevronDown className="w-3 h-3 stroke-[3]" />
          ) : (
            <ChevronUp className="w-3 h-3 stroke-[3]" />
          )}
        </div>
      </div>
    </motion.div>
  );
};
