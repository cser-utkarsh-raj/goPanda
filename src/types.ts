export type TimerMode = 'pomodoro' | 'stopwatch' | 'countdown';

export type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak';

export interface SubTask {
  id: string;
  title: string;
  targetSeconds: number; // e.g. 3600 for 1 hr
  elapsedSeconds: number;
  completed: boolean;
  colorTag?: string;
}

export interface StickyNoteItem {
  id: string;
  text: string;
  done: boolean;
}

export type StickyNoteColor = 'matcha' | 'bamboo' | 'creamy' | 'peach' | 'lavender' | 'slate';

export interface StickyNote {
  id: string;
  title: string;
  content: string;
  color: StickyNoteColor;
  pinned: boolean;
  isChecklist: boolean;
  items: StickyNoteItem[];
  createdAt: number;
  updatedAt: number;
}

export interface TimerSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  longBreakInterval: number; // every X pomodoros
  soundEnabled: boolean;
  volume: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  theme: 'matcha' | 'monochrome' | 'sakura' | 'night';
}

export type PandaMood = 'focus' | 'break' | 'sleeping' | 'happy' | 'celebrating' | 'cheering';

export interface ElectronAPI {
  isElectron: boolean;
  switchViewMode: (mode: 'mini' | 'full') => void;
  toggleViewMode: () => void;
  minimizeApp: () => void;
  closeApp: () => void;
  onModeChanged: (callback: (mode: 'mini' | 'full') => void) => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
