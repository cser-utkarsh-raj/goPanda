import { motion } from 'motion/react';
import React from 'react';
import { Play, Pause, Maximize2, SkipForward, CheckCircle2 } from 'lucide-react';
import { PandaMood, PomodoroPhase, SubTask, TimerMode } from '../types';
import { PandaMascot } from './PandaMascot';
import { formatHumanDuration, formatTime } from '../utils/time';
import { playBambooClick } from '../utils/audio';

interface MiniWidgetProps {
  mode: TimerMode;
  phase: PomodoroPhase;
  remainingSeconds: number;
  stopwatchElapsedSeconds: number;
  isRunning: boolean;
  activeTask: SubTask | null;
  mood: PandaMood;
  soundEnabled: boolean;
  onTogglePlayPause: () => void;
  onSkipPhase: () => void;
  onExpand: () => void;
}

export const MiniWidget: React.FC<MiniWidgetProps> = ({
  mode,
  phase,
  remainingSeconds,
  stopwatchElapsedSeconds,
  isRunning,
  activeTask,
  mood,
  soundEnabled,
  onTogglePlayPause,
  onSkipPhase,
  onExpand,
}) => {
  const displayTime = mode === 'stopwatch'
    ? formatTime(stopwatchElapsedSeconds)
    : formatTime(remainingSeconds);

  const taskProgress = activeTask && activeTask.targetSeconds > 0
    ? Math.min(100, Math.round((activeTask.elapsedSeconds / activeTask.targetSeconds) * 100))
    : 0;

  return (
    <motion.div
      layout
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="fixed bottom-6 right-6 z-40 bg-white rounded-[24px] border-2 border-black shadow-[5px_5px_0px_0px_#000] p-3.5 w-80 max-w-[calc(100vw-2rem)] select-none animate-in fade-in"
      id="pomo-panda-mini-widget"
    >
      <div className="flex items-center justify-between pb-2 border-b-2 border-stone-100">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black animate-pulse" />
          <span className="text-xs font-black text-stone-950">goPanda</span>
          <span className="text-[10px] px-2 py-0.5 bg-emerald-300 border border-black text-stone-950 font-black rounded-md shadow-[1px_1px_0px_0px_#000]">
            {mode === 'stopwatch' ? 'Continuous' : phase === 'work' ? 'Focus' : 'Break'}
          </span>
        </div>

        <button
          onClick={() => {
            onExpand();
            if (soundEnabled) playBambooClick(0.2);
          }}
          className="p-1.5 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg border border-black/10 transition-colors"
          title="Expand to Full Workspace"
        >
          <Maximize2 className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      <div className="flex items-center gap-3 my-2.5">
        {/* Tiny Panda */}
        <div className="w-14 h-14 shrink-0">
          <PandaMascot
            mood={mood}
            size="sm"
            showSpeechBubble={false}
            isTimerRunning={isRunning}
          />
        </div>

        {/* Time and Active Task */}
        <div className="flex-1 min-w-0">
          <div className="text-2xl font-mono font-black text-stone-950 leading-none">
            {displayTime}
          </div>

          <div className="mt-1 flex items-center gap-1 text-[11px] text-stone-700 truncate font-bold">
            {activeTask ? (
              <span className="truncate text-stone-900">
                {activeTask.title} ({formatHumanDuration(activeTask.elapsedSeconds)} / {formatHumanDuration(activeTask.targetSeconds)})
              </span>
            ) : (
              <span className="text-stone-400 font-normal">No active subtask</span>
            )}
          </div>

          {activeTask && (
            <div className="mt-1.5 h-2 w-full bg-stone-100 border border-black rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${taskProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-2 border-t-2 border-stone-100">
        <span className="text-[11px] text-stone-600 font-bold">
          {activeTask?.completed ? (
            <span className="text-emerald-800 font-black flex items-center gap-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> Done
            </span>
          ) : (
            `Progress: ${taskProgress}%`
          )}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              onTogglePlayPause();
              if (soundEnabled) playBambooClick(0.3);
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black text-stone-950 border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all ${
              isRunning ? 'bg-[#FEF08A] hover:bg-[#FDE047]' : 'bg-emerald-400 hover:bg-emerald-500'
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
                <span>Play</span>
              </>
            )}
          </button>

          {mode === 'pomodoro' && (
            <button
              onClick={() => {
                onSkipPhase();
                if (soundEnabled) playBambooClick(0.2);
              }}
              className="p-1 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-lg border border-black/20 transition-colors"
              title="Skip Phase"
            >
              <SkipForward className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
