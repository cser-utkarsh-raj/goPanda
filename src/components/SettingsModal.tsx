import React from 'react';
import { X, Volume2, Sliders, ShieldCheck } from 'lucide-react';
import { TimerSettings } from '../types';
import { playBambooClick, playChime } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  settings: TimerSettings;
  onClose: () => void;
  onSaveSettings: (settings: TimerSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onSaveSettings,
}) => {
  if (!isOpen) return null;

  const handleChange = <K extends keyof TimerSettings>(key: K, value: TimerSettings[K]) => {
    onSaveSettings({ ...settings, [key]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-[24px] border-2 border-black shadow-[6px_6px_0px_0px_#000] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-black bg-[#E8F5E9]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-400 border border-black flex items-center justify-center text-stone-950 shadow-[1px_1px_0px_0px_#000]">
              <Sliders className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="font-black text-stone-950 text-sm sm:text-base">goPanda Settings</h3>
          </div>
          <button
            onClick={() => {
              onClose();
              if (settings.soundEnabled) playBambooClick(0.2);
            }}
            className="p-1.5 text-stone-700 hover:text-stone-950 hover:bg-stone-200 rounded-xl border border-black transition-colors"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar text-xs">
          {/* Pomodoro Intervals */}
          <div className="space-y-3">
            <h4 className="font-black text-stone-900 flex items-center gap-1.5 text-xs sm:text-sm">
              <span>⏱️ Timer Durations (minutes)</span>
            </h4>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-stone-50 p-2.5 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                <label className="text-[11px] font-bold text-stone-700 block mb-1">Focus Work</label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={settings.workDuration}
                  onChange={(e) => handleChange('workDuration', Math.max(1, parseInt(e.target.value) || 25))}
                  className="w-full text-center font-black text-stone-950 bg-white border-2 border-black rounded-xl py-1 focus:outline-none"
                />
              </div>

              <div className="bg-stone-50 p-2.5 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                <label className="text-[11px] font-bold text-stone-700 block mb-1">Short Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.shortBreakDuration}
                  onChange={(e) => handleChange('shortBreakDuration', Math.max(1, parseInt(e.target.value) || 5))}
                  className="w-full text-center font-black text-stone-950 bg-white border-2 border-black rounded-xl py-1 focus:outline-none"
                />
              </div>

              <div className="bg-stone-50 p-2.5 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                <label className="text-[11px] font-bold text-stone-700 block mb-1">Long Break</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={settings.longBreakDuration}
                  onChange={(e) => handleChange('longBreakDuration', Math.max(1, parseInt(e.target.value) || 15))}
                  className="w-full text-center font-black text-stone-950 bg-white border-2 border-black rounded-xl py-1 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <span className="text-stone-900 font-bold">Long Break Interval:</span>
              <div className="flex items-center gap-2">
                <span className="text-stone-600 font-medium">Every</span>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={settings.longBreakInterval}
                  onChange={(e) => handleChange('longBreakInterval', Math.max(1, parseInt(e.target.value) || 4))}
                  className="w-12 text-center font-black text-stone-950 bg-white border-2 border-black rounded-xl py-0.5"
                />
                <span className="text-stone-600 font-medium">cycles</span>
              </div>
            </div>
          </div>

          {/* Sound & Audio */}
          <div className="space-y-2 pt-2 border-t-2 border-stone-100">
            <h4 className="font-black text-stone-900 flex items-center gap-1.5 text-xs sm:text-sm">
              <Volume2 className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
              <span>Audio & Chimes</span>
            </h4>
            <div className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <div>
                <div className="font-black text-stone-950">Sound Effects & Bells</div>
                <div className="text-[10px] text-stone-500 font-medium">Lightweight Web Audio synthesizer</div>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => handleChange('soundEnabled', e.target.checked)}
                className="w-5 h-5 text-emerald-600 accent-emerald-500 rounded border-2 border-black cursor-pointer"
              />
            </div>

            {settings.soundEnabled && (
              <div className="p-3 bg-stone-50 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-between gap-3">
                <span className="text-stone-900 font-bold shrink-0">Volume ({Math.round(settings.volume * 100)}%)</span>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={settings.volume}
                  onChange={(e) => handleChange('volume', parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => playChime(settings.volume)}
                  className="px-2.5 py-1 bg-white border-2 border-black hover:bg-stone-100 rounded-xl text-[11px] font-black text-stone-950 shrink-0 shadow-[1px_1px_0px_0px_#000]"
                >
                  Test Chime
                </button>
              </div>
            )}
          </div>

          {/* Auto Start Preferences */}
          <div className="space-y-2 pt-2 border-t-2 border-stone-100">
            <h4 className="font-black text-stone-900 text-xs sm:text-sm">Automation</h4>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer">
                <span className="text-stone-900 font-bold">Auto-start breaks when focus ends</span>
                <input
                  type="checkbox"
                  checked={settings.autoStartBreaks}
                  onChange={(e) => handleChange('autoStartBreaks', e.target.checked)}
                  className="w-5 h-5 text-emerald-600 accent-emerald-500 rounded border-2 border-black"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer">
                <span className="text-stone-900 font-bold">Auto-start Pomodoros when break ends</span>
                <input
                  type="checkbox"
                  checked={settings.autoStartPomodoros}
                  onChange={(e) => handleChange('autoStartPomodoros', e.target.checked)}
                  className="w-5 h-5 text-emerald-600 accent-emerald-500 rounded border-2 border-black"
                />
              </label>
            </div>
          </div>

          {/* Performance & Memory Footprint Note */}
          <div className="p-3 bg-[#E8F5E9] border-2 border-black rounded-2xl shadow-[2px_2px_0px_0px_#000] flex items-start gap-2 text-stone-950">
            <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-tight">
              <span className="font-black">Ultra-Lightweight Architecture:</span> goPanda uses zero external image assets or heavy audio files — running in kilobytes of memory with instant local persistence.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-stone-50 border-t-2 border-black flex justify-end">
          <button
            onClick={() => {
              onClose();
              if (settings.soundEnabled) playBambooClick(0.3);
            }}
            className="px-5 py-2 bg-emerald-400 hover:bg-emerald-500 text-stone-950 rounded-xl text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
