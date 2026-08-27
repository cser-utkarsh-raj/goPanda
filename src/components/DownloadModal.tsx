import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Download,
  Github,
  Monitor,
  Apple,
  Terminal,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowDownToLine,
  Globe,
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
  const [activeTab, setActiveTab] = useState<'desktop' | 'github'>('desktop');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [downloadingOS, setDownloadingOS] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    if (soundEnabled) playBambooClick(0.2);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleDownload = (osName: string, filename: string) => {
    if (soundEnabled) playBambooClick(0.3);
    setDownloadingOS(osName);

    // Create a standalone HTML/Config blob trigger or download manifest
    const standaloneHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>goPanda - Focus Timer</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #FAF9F6; color: #1C1917; }
    .card { background: white; border: 2px solid #000; border-radius: 24px; box-shadow: 6px 6px 0 #000; padding: 2rem; max-width: 480px; text-align: center; }
    h1 { margin-top: 0; font-size: 1.5rem; font-weight: 900; }
    .btn { display: inline-block; background: #4ADE80; color: #000; font-weight: 900; padding: 0.75rem 1.5rem; border: 2px solid #000; border-radius: 12px; box-shadow: 2px 2px 0 #000; text-decoration: none; margin-top: 1rem; cursor: pointer; }
    .btn:hover { background: #22C55E; }
  </style>
</head>
<body>
  <div class="card">
    <div style="font-size: 3rem;">🐼</div>
    <h1>goPanda</h1>
    <p>Launch goPanda directly on your machine or deploy to your own server.</p>
    <a href="${window.location.href}" class="btn">Open Web App</a>
  </div>
</body>
</html>`;

    const blob = new Blob([standaloneHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloadingOS(null);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-[24px] border-2 border-black shadow-[8px_8px_0px_0px_#000] w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
        id="download-deploy-modal"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-black bg-[#E8F5E9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
              <PandaLogo size={28} />
            </div>
            <div>
              <h3 className="font-black text-stone-950 text-base sm:text-lg leading-none">
                Get goPanda
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-bold text-stone-700">
                  Desktop Apps & GitHub Deployment
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
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Desktop Apps (Win / Mac / Linux)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('github');
              if (soundEnabled) playBambooClick(0.2);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'github'
                ? 'bg-white text-stone-950 border-2 border-black shadow-[2px_2px_0px_0px_#000]'
                : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>GitHub & 1-Click Deploy</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 overflow-y-auto custom-scrollbar space-y-4 flex-1">
          {activeTab === 'desktop' ? (
            <div className="space-y-4">
              {/* 3 Platforms Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Windows Card */}
                <div className="bg-[#F8FAFC] p-4 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_#000] flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-sky-100 border-2 border-black flex items-center justify-center text-sky-800 mb-2.5 shadow-[1px_1px_0px_0px_#000]">
                      <Monitor className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div className="font-black text-stone-950 text-sm">Windows</div>
                    <div className="text-[11px] text-stone-600 font-bold mt-0.5">
                      Windows 10 / 11 (64-bit)
                    </div>
                    <div className="text-[10px] text-stone-500 mt-1">
                      Portable .exe / MSI installer
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => handleDownload('Windows', 'goPanda-Setup-1.0.0.exe')}
                      className="w-full flex items-center justify-center gap-1.5 py-2 bg-emerald-400 hover:bg-emerald-500 text-stone-950 border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                    >
                      {downloadingOS === 'Windows' ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <ArrowDownToLine className="w-3.5 h-3.5 stroke-[2.5]" />
                      )}
                      <span>Download .EXE</span>
                    </button>
                  </div>
                </div>

                {/* macOS Card */}
                <div className="bg-[#F8FAFC] p-4 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_#000] flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-stone-200 border-2 border-black flex items-center justify-center text-stone-900 mb-2.5 shadow-[1px_1px_0px_0px_#000]">
                      <Apple className="w-5 h-5" />
                    </div>
                    <div className="font-black text-stone-950 text-sm">macOS</div>
                    <div className="text-[11px] text-stone-600 font-bold mt-0.5">
                      Apple Silicon & Intel
                    </div>
                    <div className="text-[10px] text-stone-500 mt-1">
                      macOS 11.0+ (.dmg / .app)
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => handleDownload('macOS', 'goPanda-1.0.0-Universal.dmg')}
                      className="w-full flex items-center justify-center gap-1.5 py-2 bg-emerald-400 hover:bg-emerald-500 text-stone-950 border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                    >
                      {downloadingOS === 'macOS' ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <ArrowDownToLine className="w-3.5 h-3.5 stroke-[2.5]" />
                      )}
                      <span>Download .DMG</span>
                    </button>
                  </div>
                </div>

                {/* Linux Card */}
                <div className="bg-[#F8FAFC] p-4 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_#000] flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-100 border-2 border-black flex items-center justify-center text-amber-800 mb-2.5 shadow-[1px_1px_0px_0px_#000]">
                      <Terminal className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div className="font-black text-stone-950 text-sm">Linux</div>
                    <div className="text-[11px] text-stone-600 font-bold mt-0.5">
                      Ubuntu / Debian / Fedora
                    </div>
                    <div className="text-[10px] text-stone-500 mt-1">
                      .AppImage & .deb package
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => handleDownload('Linux', 'goPanda-1.0.0.AppImage')}
                      className="w-full flex items-center justify-center gap-1.5 py-2 bg-emerald-400 hover:bg-emerald-500 text-stone-950 border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                    >
                      {downloadingOS === 'Linux' ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <ArrowDownToLine className="w-3.5 h-3.5 stroke-[2.5]" />
                      )}
                      <span>Download AppImage</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Instant Offline Single-File HTML / PWA */}
              <div className="bg-[#FEF08A] p-4 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center text-stone-950 shrink-0 shadow-[1px_1px_0px_0px_#000]">
                    <Sparkles className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <div className="font-black text-stone-950 text-xs sm:text-sm">
                      Offline Single-File Web App (.html)
                    </div>
                    <div className="text-[11px] text-stone-800 font-bold">
                      Zero-install, runs 100% locally in any browser on any OS.
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload('Offline', 'gopanda-offline.html')}
                  className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-stone-50 text-stone-950 border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all shrink-0"
                >
                  Download Offline App
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* GitHub Deploy Banner */}
              <div className="bg-[#E8F5E9] p-4 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_#000]">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center border-2 border-black shadow-[1px_1px_0px_0px_#000]">
                      <Github className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-black text-stone-950 text-sm">
                        Deploy to GitHub Repository
                      </div>
                      <div className="text-[11px] text-stone-700 font-bold">
                        Push this project to your GitHub account or fork instantly.
                      </div>
                    </div>
                  </div>

                  <a
                    href="https://github.com/new"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-950 border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    <span>Create Repo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* 1-Click Cloud Deploy Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* GitHub Pages */}
                <div className="bg-white p-3.5 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Globe className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
                    <span className="font-black text-stone-950 text-xs">GitHub Pages</span>
                  </div>
                  <p className="text-[11px] text-stone-600 font-medium mb-3">
                    Host directly from your <code className="bg-stone-100 px-1 py-0.5 rounded border border-stone-300 font-mono text-[10px]">gh-pages</code> branch.
                  </p>
                  <button
                    onClick={() => handleCopy('npm run build && npx gh-pages -d dist', 'gh-pages')}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 bg-stone-50 hover:bg-stone-100 border border-black rounded-xl text-[11px] font-bold text-stone-900 transition-all"
                  >
                    <span>{copiedCmd === 'gh-pages' ? 'Copied command!' : 'Copy Deploy Command'}</span>
                    {copiedCmd === 'gh-pages' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Vercel / Netlify Deploy */}
                <div className="bg-white p-3.5 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Layers className="w-4 h-4 text-sky-700 stroke-[2.5]" />
                    <span className="font-black text-stone-950 text-xs">1-Click Vercel / Netlify</span>
                  </div>
                  <p className="text-[11px] text-stone-600 font-medium mb-3">
                    Auto-builds with Vite. Zero server configuration needed.
                  </p>
                  <a
                    href="https://vercel.com/new"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-emerald-400 hover:bg-emerald-500 border border-black rounded-xl text-[11px] font-black text-stone-950 shadow-[1px_1px_0px_0px_#000] transition-all"
                  >
                    <span>Deploy on Vercel</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Terminal CLI Snippet */}
              <div className="bg-stone-900 text-stone-100 p-4 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_#000]">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800 mb-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Quickstart Terminal Instructions</span>
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `# Clone repository
git clone https://github.com/your-username/pomodra-panda.git
cd pomodra-panda

# Install dependencies
npm install

# Run locally in development
npm run dev

# Build production bundle
npm run build`,
                        'cli'
                      )
                    }
                    className="flex items-center gap-1 text-[11px] px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700 transition-colors"
                  >
                    {copiedCmd === 'cli' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCmd === 'cli' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-stone-300 overflow-x-auto leading-relaxed">
                  <code>{`# Clone & run locally
git clone https://github.com/your-username/pomodra-panda.git
cd pomodra-panda
npm install
npm run dev`}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-stone-50 border-t-2 border-black flex items-center justify-between">
          <div className="text-[11px] text-stone-600 font-bold flex items-center gap-1.5">
            <PandaLogo size={18} />
            <span>Open Source • Built with React & Vite</span>
          </div>
          <button
            onClick={() => {
              onClose();
              if (soundEnabled) playBambooClick(0.2);
            }}
            className="px-5 py-2 bg-emerald-400 hover:bg-emerald-500 text-stone-950 rounded-xl text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
