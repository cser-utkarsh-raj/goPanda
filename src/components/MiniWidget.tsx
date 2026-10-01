import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Pause, Play, SkipForward } from 'lucide-react';
import { PandaMood, PomodoroPhase, SubTask, TimerMode } from '../types';
import { PandaLogo } from './PandaLogo';
import { formatTime } from '../utils/time';
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

/**
 * Desktop companion widget.
 *
 * The widget is intentionally not a mini dashboard:
 * - idle: small circular panda + progress ring
 * - hover: the circle grows and reveals the remaining time
 * - single click: play/pause
 * - double click: open the full goPanda workspace
 */
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
  onExpand,
}) => {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');

    const previous = {
      htmlBackground: html.style.background,
      htmlBackgroundColor: html.style.backgroundColor,
      bodyBackground: body.style.background,
      bodyBackgroundColor: body.style.backgroundColor,
      bodyBackgroundImage: body.style.backgroundImage,
      bodyMinHeight: body.style.minHeight,
      rootBackground: root?.style.background ?? '',
      rootBackgroundColor: root?.style.backgroundColor ?? '',
      rootMinHeight: root?.style.minHeight ?? '',
    };

    html.style.background = 'transparent';
    html.style.backgroundColor = 'transparent';
    body.style.background = 'transparent';
    body.style.backgroundColor = 'transparent';
    body.style.backgroundImage = 'none';
    body.style.minHeight = '0';

    if (root) {
      root.style.background = 'transparent';
      root.style.backgroundColor = 'transparent';
      root.style.minHeight = '0';
    }

    return () => {
      html.style.background = previous.htmlBackground;
      html.style.backgroundColor = previous.htmlBackgroundColor;
      body.style.background = previous.bodyBackground;
      body.style.backgroundColor = previous.bodyBackgroundColor;
      body.style.backgroundImage = previous.bodyBackgroundImage;
      body.style.minHeight = previous.bodyMinHeight;

      if (root) {
        root.style.background = previous.rootBackground;
        root.style.backgroundColor = previous.rootBackgroundColor;
        root.style.minHeight = previous.rootMinHeight;
      }
    };
  }, []);

  const displayTime =
    mode === 'stopwatch'
      ? formatTime(stopwatchElapsedSeconds)
      : formatTime(remainingSeconds);

  const progress =
    mode === 'stopwatch'
      ? (stopwatchElapsedSeconds % (25 * 60)) / (25 * 60)
      : totalDurationSeconds > 0
        ? Math.min(1, Math.max(0, 1 - remainingSeconds / totalDurationSeconds))
        : 0;

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const phaseLabel =
    mode === 'stopwatch'
      ? 'STOPWATCH'
      : phase === 'work'
        ? 'FOCUS'
        : phase === 'shortBreak'
          ? 'BREAK'
          : 'LONG BREAK';

  const handleClick = () => {
    if (soundEnabled) playBambooClick(0.25);
    onTogglePlayPause();
  };

  const handleDoubleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (soundEnabled) playBambooClick(0.2);
    onExpand();
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center select-none bg-transparent"
      id="gopanda-desktop-widget"
      title="Single click to pause/resume · Double click to open goPanda"
    >
      <motion.button
        type="button"
        initial={{ width: 82, height: 82, opacity: 0, scale: 0.88 }}
        animate={{ width: 82, height: 82, opacity: 1, scale: 1 }}
        whileHover={{ width: 142, height: 142 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        className="group relative rounded-full outline-none cursor-pointer"
        aria-label={`goPanda ${displayTime}. Double click to open the full app.`}
      >
        <span
          className={`absolute inset-0 rounded-full transition-all duration-300 ${
            isRunning
              ? 'shadow-[0_8px_28px_rgba(34,197,94,0.28)]'
              : 'shadow-[0_6px_22px_rgba(0,0,0,0.20)]'
          }`}
        />

        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="rgba(255,255,255,0.96)"
            stroke="rgba(28,25,23,0.16)"
            strokeWidth="5"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={phase === 'work' || mode === 'stopwatch' ? '#22C55E' : '#F59E0B'}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-[stroke-dashoffset] duration-500 ease-linear"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#1C1917"
            strokeWidth="1.5"
            opacity="0.9"
          />
        </svg>

        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.span
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            className="w-[48%] h-[48%] flex items-center justify-center"
          >
            <PandaLogo size={48} />
          </motion.span>
        </span>

        <motion.span
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.12 }}
          className="absolute inset-0 flex flex-col items-center justify-end pb-[17%] pointer-events-none"
        >
          <span className="font-mono font-black text-stone-950 text-[17px] leading-none tracking-tight">
            {displayTime}
          </span>
          <span className="mt-1 text-[7px] font-black tracking-[0.18em] text-stone-500">
            {phaseLabel}
          </span>
          {activeTask && (
            <span className="mt-1 max-w-[68%] truncate text-[7px] font-bold text-stone-600">
              {activeTask.title}
            </span>
          )}
        </motion.span>

        <span
          className={`absolute top-[9%] right-[9%] w-2.5 h-2.5 rounded-full border-2 border-white ${
            isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-stone-300'
          }`}
        />

        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.12 }}
          className="absolute left-1/2 -translate-x-1/2 top-[7%] flex items-center gap-1.5 pointer-events-none"
        >
          <span
            className="w-7 h-7 rounded-full bg-white/95 border border-stone-300 shadow-sm flex items-center justify-center text-stone-900"
            title={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? (
              <Pause className="w-3 h-3 fill-current" />
            ) : (
              <Play className="w-3 h-3 fill-current ml-0.5" />
            )}
          </span>
          {mode === 'pomodoro' && (
            <span className="w-7 h-7 rounded-full bg-white/95 border border-stone-300 shadow-sm flex items-center justify-center text-stone-900">
              <SkipForward className="w-3 h-3" />
            </span>
          )}
        </motion.span>
      </motion.button>
    </div>
  );
};
