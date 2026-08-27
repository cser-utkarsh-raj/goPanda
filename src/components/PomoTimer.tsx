import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Plus,
  Minus,
  Flame,
  Coffee,
  Moon,
  Zap,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Waves,
  CloudRain,
  Wind,
  Brain,
  Headphones,
} from 'lucide-react';
import { PomodoroPhase, SubTask, TimerMode } from '../types';
import { formatTime } from '../utils/time';
import {
  playBambooClick,
  startAmbientSound,
  stopAmbientSound,
  AmbientSoundType,
} from '../utils/audio';

interface PomoTimerProps {
  mode: TimerMode;
  phase: PomodoroPhase;
  remainingSeconds: number;
  totalDurationSeconds: number;
  stopwatchElapsedSeconds: number;
  isRunning: boolean;
  pomodoroCount: number;
  longBreakInterval: number;
  activeTask: SubTask | null;
  soundEnabled: boolean;
  onTogglePlayPause: () => void;
  onReset: () => void;
  onSkipPhase: () => void;
  onAddMinutes: (minutes: number) => void;
  onSelectMode: (mode: TimerMode) => void;
  onSelectPhase: (phase: PomodoroPhase) => void;
  onToggleSound: () => void;
}

export const PomoTimer: React.FC<PomoTimerProps> = ({
  mode,
  phase,
  remainingSeconds,
  totalDurationSeconds,
  stopwatchElapsedSeconds,
  isRunning,
  pomodoroCount,
  longBreakInterval,
  activeTask,
  soundEnabled,
  onTogglePlayPause,
  onReset,
  onSkipPhase,
  onAddMinutes,
  onSelectMode,
  onSelectPhase,
  onToggleSound,
}) => {
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>('off');
  const [showAmbientMenu, setShowAmbientMenu] = useState(false);

  // Calculation of progress percentage
  let progressFraction = 0;
  let displayTime = '00:00';
  let percentageInt = 0;

  if (mode === 'pomodoro' || mode === 'countdown') {
    progressFraction = totalDurationSeconds > 0
      ? Math.max(0, Math.min(1, 1 - remainingSeconds / totalDurationSeconds))
      : 0;
    displayTime = formatTime(remainingSeconds);
    percentageInt = Math.round(progressFraction * 100);
  } else {
    // Stopwatch mode
    displayTime = formatTime(stopwatchElapsedSeconds);
    progressFraction = (stopwatchElapsedSeconds % 3600) / 3600;
    percentageInt = Math.round(progressFraction * 100);
  }

  // Dial Geometry
  const size = 260;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressFraction * circumference;

  // Angle for the glowing orbital knob
  const angleDeg = progressFraction * 360 - 90;
  const angleRad = (angleDeg * Math.PI) / 180;
  const knobX = size / 2 + radius * Math.cos(angleRad);
  const knobY = size / 2 + radius * Math.sin(angleRad);

  // Theme color accents based on current phase
  const getPhaseTheme = () => {
    if (mode === 'stopwatch') {
      return {
        accent: '#0d9488', // teal-600
        glow: 'rgba(13, 148, 136, 0.4)',
        badgeBg: 'bg-teal-300',
        badgeText: 'text-stone-950',
        trackColor: '#CCFBF1',
        label: 'Continuous Focus',
        border: 'border-teal-500',
      };
    }
    switch (phase) {
      case 'work':
        return {
          accent: '#10B981', // emerald-500
          glow: 'rgba(16, 185, 129, 0.45)',
          badgeBg: 'bg-emerald-400',
          badgeText: 'text-stone-950',
          trackColor: '#D1FAE5',
          label: 'Deep Focus Work',
          border: 'border-emerald-500',
        };
      case 'shortBreak':
        return {
          accent: '#38BDF8', // sky-400
          glow: 'rgba(56, 189, 248, 0.45)',
          badgeBg: 'bg-sky-300',
          badgeText: 'text-stone-950',
          trackColor: '#E0F2FE',
          label: 'Short Refresh Break',
          border: 'border-sky-400',
        };
      case 'longBreak':
        return {
          accent: '#C084FC', // purple-400
          glow: 'rgba(192, 132, 252, 0.45)',
          badgeBg: 'bg-purple-300',
          badgeText: 'text-stone-950',
          trackColor: '#F3E8FF',
          label: 'Long Zen Break',
          border: 'border-purple-400',
        };
    }
  };

  const currentTheme = getPhaseTheme();

  const handleAmbientChange = (type: AmbientSoundType) => {
    setAmbientSound(type);
    if (type === 'off') {
      stopAmbientSound();
    } else {
      startAmbientSound(type, 0.35);
    }
    if (soundEnabled) playBambooClick(0.2);
  };

  return (
    <div
      className="flex flex-col items-center justify-between w-full h-full p-4 sm:p-5 bg-white rounded-[24px] border-2 border-black shadow-[5px_5px_0px_0px_#000] relative overflow-hidden"
      id="pomo-timer-card"
    >
      {/* Top Bar: Mode Selectors & Quick Ambient Soundscapes */}
      <div className="w-full flex items-center justify-between gap-2 pb-3 border-b-2 border-stone-100">
        {/* Mode Pills: Pomodoro vs Continuous Stopwatch */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
          <button
            id="tab-mode-pomodoro"
            onClick={() => {
              onSelectMode('pomodoro');
              if (soundEnabled) playBambooClick(0.2);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              mode === 'pomodoro'
                ? 'bg-emerald-400 text-stone-950 border border-black shadow-[1px_1px_0px_0px_#000]'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Pomodoro</span>
          </button>
          <button
            id="tab-mode-stopwatch"
            onClick={() => {
              onSelectMode('stopwatch');
              if (soundEnabled) playBambooClick(0.2);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              mode === 'stopwatch'
                ? 'bg-teal-400 text-stone-950 border border-black shadow-[1px_1px_0px_0px_#000]'
                : 'text-stone-700 hover:text-stone-950'
            }`}
            title="Continuous count-up stopwatch"
          >
            <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Continuous</span>
          </button>
        </div>

        {/* Ambient Soundscape Dropdown & Audio Chimes */}
        <div className="flex items-center gap-2 relative">
          {/* Ambient Soundscapes toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setShowAmbientMenu(!showAmbientMenu);
                if (soundEnabled) playBambooClick(0.2);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-black border-2 border-black transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 ${
                ambientSound !== 'off'
                  ? 'bg-[#FEF08A] text-stone-950 animate-pulse'
                  : 'bg-white text-stone-700 hover:bg-stone-50'
              }`}
              title="Ambient background soundscapes for focus"
            >
              <Headphones className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">
                {ambientSound === 'off' ? 'Soundscape' : ambientSound}
              </span>
            </button>

            {/* Ambient Sound Menu */}
            <AnimatePresence>
              {showAmbientMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  className="absolute right-0 top-10 z-30 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] p-2 w-48 space-y-1"
                >
                  <div className="text-[10px] font-black text-stone-500 uppercase px-2 py-1 border-b border-stone-100">
                    Focus Soundscapes
                  </div>
                  <button
                    onClick={() => {
                      handleAmbientChange('off');
                      setShowAmbientMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      ambientSound === 'off'
                        ? 'bg-stone-200 text-stone-950 font-black'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>Mute Soundscape</span>
                    <VolumeX className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      handleAmbientChange('rain');
                      setShowAmbientMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      ambientSound === 'rain'
                        ? 'bg-emerald-300 text-stone-950 font-black border border-black'
                        : 'text-stone-700 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <CloudRain className="w-3.5 h-3.5 text-sky-600" />
                      <span>Forest Rain</span>
                    </span>
                    <span className="text-[10px] text-stone-500">🌧️</span>
                  </button>
                  <button
                    onClick={() => {
                      handleAmbientChange('zenriver');
                      setShowAmbientMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      ambientSound === 'zenriver'
                        ? 'bg-emerald-300 text-stone-950 font-black border border-black'
                        : 'text-stone-700 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Waves className="w-3.5 h-3.5 text-teal-600" />
                      <span>Zen Stream</span>
                    </span>
                    <span className="text-[10px] text-stone-500">🎋</span>
                  </button>
                  <button
                    onClick={() => {
                      handleAmbientChange('whitenoise');
                      setShowAmbientMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      ambientSound === 'whitenoise'
                        ? 'bg-emerald-300 text-stone-950 font-black border border-black'
                        : 'text-stone-700 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-stone-600" />
                      <span>White Noise</span>
                    </span>
                    <span className="text-[10px] text-stone-500">💨</span>
                  </button>
                  <button
                    onClick={() => {
                      handleAmbientChange('thetawaves');
                      setShowAmbientMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      ambientSound === 'thetawaves'
                        ? 'bg-emerald-300 text-stone-950 font-black border border-black'
                        : 'text-stone-700 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5 text-purple-600" />
                      <span>Theta Waves (40Hz)</span>
                    </span>
                    <span className="text-[10px] text-stone-500">🧠</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sound Bell Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl border-2 border-black transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 ${
              soundEnabled
                ? 'bg-emerald-400 text-stone-950'
                : 'bg-stone-100 text-stone-400'
            }`}
            title={soundEnabled ? 'Mute bell chimes' : 'Unmute bell chimes'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <VolumeX className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>

      {/* Phase Switcher for Pomodoro Mode */}
      {mode === 'pomodoro' && (
        <div className="flex items-center gap-1.5 mt-3 bg-stone-100 p-1.5 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
          <button
            onClick={() => {
              onSelectPhase('work');
              if (soundEnabled) playBambooClick(0.2);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              phase === 'work'
                ? 'bg-emerald-400 text-stone-950 border border-black shadow-[1px_1px_0px_0px_#000]'
                : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Focus</span>
          </button>
          <button
            onClick={() => {
              onSelectPhase('shortBreak');
              if (soundEnabled) playBambooClick(0.2);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              phase === 'shortBreak'
                ? 'bg-sky-300 text-stone-950 border border-black shadow-[1px_1px_0px_0px_#000]'
                : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Short Break</span>
          </button>
          <button
            onClick={() => {
              onSelectPhase('longBreak');
              if (soundEnabled) playBambooClick(0.2);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              phase === 'longBreak'
                ? 'bg-purple-300 text-stone-950 border border-black shadow-[1px_1px_0px_0px_#000]'
                : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Long Break</span>
          </button>
        </div>
      )}

      {/* Chronometer-Grade Circular Dial with Animated Ticks and Glowing Orb */}
      <div className="relative my-4 flex items-center justify-center">
        {/* Ambient Breathing Pulse Waves behind the dial when active */}
        {isRunning && (
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.35, 0.7, 0.35],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute w-64 h-64 rounded-full border-2 border-emerald-400 pointer-events-none -z-0"
            style={{
              boxShadow: `0 0 25px ${currentTheme.glow}`,
            }}
          />
        )}

        <div className="relative w-64 h-64 flex items-center justify-center select-none">
          <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
            {/* Defs for gradients & shadow filters */}
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={currentTheme.accent} />
                <stop offset="100%" stopColor="#22C55E" />
              </linearGradient>
              <filter id="dialShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="0" floodColor="#000000" />
              </filter>
            </defs>

            {/* Dial Ticks (60 precision chronometer notches) */}
            {Array.from({ length: 60 }).map((_, i) => {
              const isMajor = i % 5 === 0;
              const tickAngle = (i * 6 * Math.PI) / 180;
              const outerR = radius + 15;
              const innerR = isMajor ? radius + 7 : radius + 11;
              const x1 = size / 2 + innerR * Math.cos(tickAngle);
              const y1 = size / 2 + innerR * Math.sin(tickAngle);
              const x2 = size / 2 + outerR * Math.cos(tickAngle);
              const y2 = size / 2 + outerR * Math.sin(tickAngle);

              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isMajor ? '#1C1917' : '#CBD5E1'}
                  strokeWidth={isMajor ? 2.5 : 1.5}
                  strokeLinecap="round"
                />
              );
            })}

            {/* Background Outer Border Ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#000000"
              strokeWidth={strokeWidth + 4}
              fill="none"
            />

            {/* Background Track Circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#F1F5F9"
              strokeWidth={strokeWidth}
              fill="#FFFFFF"
            />

            {/* Active Smooth Dash Ring with High Contrast */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={currentTheme.accent}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: 'linear' }}
            />

            {/* Glowing Cursor Knob on Progress Head */}
            {progressFraction > 0.01 && (
              <g transform={`rotate(90 ${size / 2} ${size / 2})`}>
                <circle
                  cx={knobX}
                  cy={knobY}
                  r={8}
                  fill="#FFFFFF"
                  stroke="#000000"
                  strokeWidth={2.5}
                />
                <circle
                  cx={knobX}
                  cy={knobY}
                  r={4}
                  fill={currentTheme.accent}
                />
              </g>
            )}
          </svg>

          {/* Center Digital Display & Progress Percentage */}
          <div className="absolute flex flex-col items-center text-center pointer-events-none">
            {/* Phase Tag */}
            <div className="flex items-center gap-1 mb-1">
              <span
                className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 ${currentTheme.badgeBg} border border-black rounded-md ${currentTheme.badgeText} shadow-[1px_1px_0px_0px_#000]`}
              >
                {currentTheme.label}
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.5 bg-stone-100 border border-black rounded-md text-stone-900">
                {percentageInt}%
              </span>
            </div>

            {/* Big Watchface Digits */}
            <div className="text-4xl sm:text-5xl font-black tracking-tight font-mono text-stone-950 leading-none my-1">
              {displayTime}
            </div>

            {/* Active Subtask pill */}
            {activeTask ? (
              <div className="mt-1 px-2.5 py-0.5 bg-[#E8F5E9] border border-black rounded-full text-[11px] font-black text-stone-950 flex items-center gap-1.5 max-w-[170px] truncate shadow-[1px_1px_0px_0px_#000]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0 border border-black" />
                <span className="truncate">{activeTask.title}</span>
              </div>
            ) : (
              <span className="mt-1 text-[11px] font-bold text-stone-400">
                No active subtask
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Rounds & Pomodoro Cycle Trackers */}
      {mode === 'pomodoro' && (
        <div className="flex items-center gap-2 text-xs text-stone-900 mb-3 px-3 py-1.5 bg-[#F8FAFC] rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
          <span className="text-[11px] font-black text-stone-700">Rounds:</span>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: longBreakInterval }).map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-xl border-2 border-black flex items-center justify-center text-xs transition-all shadow-[1px_1px_0px_0px_#000] ${
                  i < pomodoroCount % longBreakInterval
                    ? 'bg-emerald-400 text-stone-950 font-black'
                    : 'bg-white text-stone-300'
                }`}
                title={`Cycle ${i + 1} of ${longBreakInterval}`}
              >
                🎋
              </div>
            ))}
          </div>
          <span className="text-[11px] font-black text-emerald-800 ml-1">
            ({pomodoroCount} completed)
          </span>
        </div>
      )}

      {/* Main Action Control Buttons */}
      <div className="flex items-center gap-3 w-full justify-center">
        {/* Reset Button */}
        <button
          id="btn-timer-reset"
          onClick={() => {
            onReset();
            if (soundEnabled) playBambooClick(0.3);
          }}
          className="p-3.5 rounded-2xl border-2 border-black bg-white hover:bg-stone-100 text-stone-950 transition-all shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000]"
          title="Reset timer (R)"
        >
          <RotateCcw className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Big Start / Pause Play Button with Tactile Depth */}
        <button
          id="btn-timer-toggle"
          onClick={() => {
            onTogglePlayPause();
            if (soundEnabled) playBambooClick(0.4);
          }}
          className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-black text-base transition-all border-2 border-black shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] ${
            isRunning
              ? 'bg-[#FEF08A] hover:bg-[#FDE047] text-stone-950'
              : 'bg-emerald-400 hover:bg-emerald-500 text-stone-950'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>Pause Focus</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current ml-0.5" />
              <span>
                {mode === 'stopwatch' && stopwatchElapsedSeconds === 0
                  ? 'Start Focus'
                  : 'Start Focus'}
              </span>
            </>
          )}
        </button>

        {/* Skip / Next Phase Button */}
        {mode === 'pomodoro' && (
          <button
            id="btn-timer-skip"
            onClick={() => {
              onSkipPhase();
              if (soundEnabled) playBambooClick(0.3);
            }}
            className="p-3.5 rounded-2xl border-2 border-black bg-white hover:bg-stone-100 text-stone-950 transition-all shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000]"
            title="Skip to next phase (S)"
          >
            <SkipForward className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Quick Focus Duration Adjustment Controls (+5m, +10m, -5m) */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t-2 border-stone-100 w-full text-xs text-stone-800">
        <div className="flex items-center gap-1.5 font-black text-stone-900">
          <Clock className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
          <span>Adjust Duration:</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              onAddMinutes(-5);
              if (soundEnabled) playBambooClick(0.2);
            }}
            className="px-2.5 py-1 bg-stone-100 hover:bg-rose-100 text-stone-900 rounded-xl transition-all font-black border-2 border-black shadow-[1px_1px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
            title="Subtract 5 minutes"
          >
            -5m
          </button>
          <button
            onClick={() => {
              onAddMinutes(5);
              if (soundEnabled) playBambooClick(0.2);
            }}
            className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-200 text-stone-900 rounded-xl transition-all font-black border-2 border-black shadow-[1px_1px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
            title="Add 5 minutes"
          >
            +5m
          </button>
          <button
            onClick={() => {
              onAddMinutes(15);
              if (soundEnabled) playBambooClick(0.2);
            }}
            className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-200 text-stone-900 rounded-xl transition-all font-black border-2 border-black shadow-[1px_1px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
            title="Add 15 minutes"
          >
            +15m
          </button>
        </div>
      </div>
    </div>
  );
};
