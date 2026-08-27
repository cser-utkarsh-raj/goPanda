import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Download,
  Monitor,
  Smartphone,
  Keyboard,
  Shield,
  Zap,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { PandaLogo } from './PandaLogo';
import { playBambooClick } from '../utils/audio';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
}) => {
  const [activeTab, setActiveTab] = useState<'desktop' | 'mobile' | 'shortcuts'>('desktop');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        'To install goPanda as a desktop application:\n\n' +
        '1. Look at the right side of your browser address bar at the top.\n' +
        '2. Click the Install / Computer icon.\n' +
        '3. Click "Install" to place goPanda on your Desktop & Taskbar.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-[24px] border-2 border-black shadow-[8px_8px_0px_0px_#000] w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col"
        id="install-modal"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-black bg-[#E8F5E9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
              <PandaLogo size={28} />
            </div>
            <div>
              <h3 className="font-black text-stone-950 text-base sm:text-lg leading-none">
                Install goPanda
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-bold text-stone-700">
                  Offline-first focus timer for all your devices
                </span>
                <span className="px-2 py-0.2 bg-emerald-400 border border-black text-stone-950 text-[10px] font-black rounded-md">
                  v1.0.0
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              if (soundEnabled) playBambooClick(0.2);
            }}
            className="p-1.5 text-stone-700 hover:text-stone-950 hover:bg-stone-200 rounded-xl border border-black transition-colors"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b-2 border-black bg-stone-100 p-2 gap-2">
          <button
            onClick={() => {
              setActiveTab('desktop');
              if (soundEnabled) playBambooClick(0.2);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'desktop'
                ? 'bg-white text-stone-950 border-2 border-black shadow-[2px_2px_0px_0px_#000]'
                : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Monitor className="w-4 h-4 stroke-[2.5] text-emerald-700" />
            <span>Desktop App</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('mobile');
              if (soundEnabled) playBambooClick(0.2);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'mobile'
                ? 'bg-white text-stone-950 border-2 border-black shadow-[2px_2px_0px_0px_#000]'
                : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Smartphone className="w-4 h-4 stroke-[2.5] text-sky-700" />
            <span>Mobile App</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('shortcuts');
              if (soundEnabled) playBambooClick(0.2);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'shortcuts'
                ? 'bg-white text-stone-950 border-2 border-black shadow-[2px_2px_0px_0px_#000]'
                : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Keyboard className="w-4 h-4 stroke-[2.5] text-purple-700" />
            <span>Shortcuts</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 overflow-y-auto custom-scrollbar space-y-4 flex-1">
          {activeTab === 'desktop' && (
            <div className="space-y-4">
              {/* Native Windows .exe Box for True Floating Circle */}
              <div className="bg-[#FEF08A] p-4 sm:p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_#000] space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                      <Monitor className="w-6 h-6 text-amber-900" />
                    </div>
                    <div>
                      <div className="font-black text-stone-950 text-base flex items-center gap-2">
                        <span>Windows Desktop EXE (.exe)</span>
                        <span className="px-2 py-0.5 bg-emerald-400 border border-black rounded-md text-[10px] font-black text-stone-950">
                          True Floating Circle
                        </span>
                      </div>
                      <div className="text-xs text-stone-800 font-bold">
                        Borderless circular widget that stays on top of YouTube & Brave
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-stone-900 leading-relaxed font-medium">
                  The native Windows package runs as a standalone, transparent floating Panda circle on your desktop. It floats permanently on top of all windows without title bars or address boxes.
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href="https://github.com/cser-utkarsh-raj/goPanda/releases/latest/download/goPanda-Setup.exe"
                    download="goPanda-Setup.exe"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-stone-950 hover:bg-stone-800 text-white font-black text-sm border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-center cursor-pointer"
                  >
                    <Download className="w-4 h-4 stroke-[3]" />
                    <span>Download goPanda (.exe)</span>
                  </a>
                </div>
              </div>

              {/* Instant Web PWA Install */}
              <div className="bg-[#E8F5E9] p-4 sm:p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_#000] space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                      <Zap className="w-6 h-6 text-emerald-800" />
                    </div>
                    <div>
                      <div className="font-black text-stone-950 text-base">
                        Web Desktop App (Instant PWA)
                      </div>
                      <div className="text-xs text-stone-700 font-bold">
                        Standalone window • Taskbar icon • 100% Offline
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-emerald-400 border border-black rounded-lg text-[10px] font-black text-stone-950 uppercase shrink-0">
                    Instant
                  </span>
                </div>

                <p className="text-xs text-stone-800 leading-relaxed font-medium">
                  Install goPanda directly from your browser. It opens in its own window without browser tabs and stores all your data offline locally on your device.
                </p>

                <button
                  onClick={handleInstallClick}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-400 hover:bg-emerald-500 text-stone-950 font-black text-xs border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  <Download className="w-4 h-4 stroke-[3]" />
                  <span>{isInstalled ? 'Web App Already Installed' : 'Install Instant Web App'}</span>
                </button>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span className="text-xs font-black text-stone-950">
                    How it works in Chrome, Edge, or Brave:
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-stone-800">
                  <div className="p-3 bg-white border border-black rounded-xl space-y-1 shadow-[1px_1px_0px_0px_#000]">
                    <div className="font-black text-stone-950 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-300 text-stone-950 text-[10px] font-black flex items-center justify-center">1</span>
                      <span>Address Bar</span>
                    </div>
                    <p className="text-[11px] text-stone-600 font-medium leading-normal">
                      Click the <strong>Install</strong> or <strong>Computer</strong> icon at the right end of the top address bar.
                    </p>
                  </div>

                  <div className="p-3 bg-white border border-black rounded-xl space-y-1 shadow-[1px_1px_0px_0px_#000]">
                    <div className="font-black text-stone-950 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-300 text-stone-950 text-[10px] font-black flex items-center justify-center">2</span>
                      <span>Confirm Install</span>
                    </div>
                    <p className="text-[11px] text-stone-600 font-medium leading-normal">
                      Click <strong>Install</strong> when the system confirmation dialog appears.
                    </p>
                  </div>

                  <div className="p-3 bg-white border border-black rounded-xl space-y-1 shadow-[1px_1px_0px_0px_#000]">
                    <div className="font-black text-stone-950 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-300 text-stone-950 text-[10px] font-black flex items-center justify-center">3</span>
                      <span>Floating & Auto-Update</span>
                    </div>
                    <p className="text-[11px] text-stone-600 font-medium leading-normal">
                      Click <strong>Floating Widget</strong> to float over any app. Updates install automatically with each push!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mobile' && (
            <div className="space-y-3">
              <div className="p-4 bg-sky-50 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-2">
                <div className="flex items-center gap-2 font-black text-stone-950 text-sm">
                  <Smartphone className="w-4 h-4 text-sky-700" />
                  <span>iOS (iPhone & iPad)</span>
                </div>
                <ol className="list-decimal list-inside text-xs text-stone-700 space-y-1.5 font-medium pl-1">
                  <li>Open goPanda in <strong>Safari</strong> on your iPhone or iPad.</li>
                  <li>Tap the <strong>Share</strong> icon (the square with the arrow pointing up) at the bottom.</li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                  <li>Tap <strong>Add</strong> in the top right. goPanda will appear as an app icon on your home screen.</li>
                </ol>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-2">
                <div className="flex items-center gap-2 font-black text-stone-950 text-sm">
                  <Zap className="w-4 h-4 text-emerald-700" />
                  <span>Android (Chrome / Brave / Firefox)</span>
                </div>
                <ol className="list-decimal list-inside text-xs text-stone-700 space-y-1.5 font-medium pl-1">
                  <li>Open goPanda in <strong>Chrome</strong> or your preferred browser.</li>
                  <li>Tap the <strong>three dots (⋮)</strong> menu in the top right.</li>
                  <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  <li>Enjoy a fullscreen focus session with no address bar distractions.</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="space-y-3">
              <div className="bg-white rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_#000] overflow-hidden">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-100 border-b-2 border-black text-stone-900 font-black">
                      <th className="p-2.5">Key</th>
                      <th className="p-2.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 font-medium text-stone-800">
                    <tr>
                      <td className="p-2.5">
                        <kbd className="px-2 py-1 bg-stone-100 border border-black rounded-md font-mono font-bold shadow-[1px_1px_0px_0px_#000]">Space</kbd>
                      </td>
                      <td className="p-2.5">Start / Pause timer</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">
                        <kbd className="px-2 py-1 bg-stone-100 border border-black rounded-md font-mono font-bold shadow-[1px_1px_0px_0px_#000]">R</kbd>
                      </td>
                      <td className="p-2.5">Reset timer</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">
                        <kbd className="px-2 py-1 bg-stone-100 border border-black rounded-md font-mono font-bold shadow-[1px_1px_0px_0px_#000]">S</kbd>
                      </td>
                      <td className="p-2.5">Skip to next phase</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">
                        <kbd className="px-2 py-1 bg-stone-100 border border-black rounded-md font-mono font-bold shadow-[1px_1px_0px_0px_#000]">M</kbd>
                      </td>
                      <td className="p-2.5">Toggle compact Mini Widget mode</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-[#E8F5E9] border-2 border-black rounded-2xl shadow-[2px_2px_0px_0px_#000] flex items-center gap-2 text-stone-950">
                <Shield className="w-4 h-4 text-emerald-800 shrink-0" />
                <span className="text-xs font-bold">
                  All tasks, notes, and study logs are saved 100% locally on your device.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t-2 border-black bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
            <PandaLogo size={16} />
            <span>goPanda • Distraction-free Focus</span>
          </div>

          <button
            onClick={() => {
              onClose();
              if (soundEnabled) playBambooClick(0.2);
            }}
            className="px-5 py-2 bg-emerald-400 hover:bg-emerald-500 text-stone-950 border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
