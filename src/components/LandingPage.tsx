import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Download,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  StickyNote,
  Clock,
  Volume2,
  Maximize2,
  ShieldCheck,
  Zap,
  Monitor,
  Apple,
  Terminal,
} from 'lucide-react';
import { PandaLogo } from './PandaLogo';
import { PandaMascot } from './PandaMascot';
import { DotCompanyLogo } from './DotCompanyLogo';

interface LandingPageProps {
  onLaunchApp?: () => void;
}

export function LandingPage({ onLaunchApp }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<'windows' | 'mac' | 'linux'>('windows');

  return (
    <div className="min-h-screen bg-[#F0FDF4] text-stone-900 font-sans selection:bg-[#FEF08A] selection:text-black relative overflow-x-hidden">
      {/* Background Animated Floating Bamboo Leaves & Dots */}
      <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 text-3xl select-none"
        >
          🎋
        </motion.div>
        <motion.div
          animate={{ y: [0, 25, 0], rotate: [0, -20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-40 right-16 text-2xl select-none"
        >
          🍃
        </motion.div>
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-32 left-20 text-3xl select-none"
        >
          🍵
        </motion.div>
        <motion.div
          animate={{ y: [0, 35, 0], rotate: [0, 25, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-48 right-12 text-3xl select-none"
        >
          🎋
        </motion.div>
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#F0FDF4]/90 backdrop-blur-md border-b-2 border-black px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
              <PandaLogo size={30} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-stone-950">goPanda</span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#CCFBF1] border border-black rounded-lg text-[11px] font-black text-teal-950 shadow-[1px_1px_0px_0px_#000]">
                  <DotCompanyLogo size={14} variant="icon" />
                  <span>.dot</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#features"
              className="hidden md:inline-block text-xs font-black text-stone-700 hover:text-black px-2.5 py-1 transition-colors"
            >
              Features
            </a>
            <a
              href="#compare"
              className="hidden md:inline-block text-xs font-black text-stone-700 hover:text-black px-2.5 py-1 transition-colors"
            >
              Performance
            </a>
            <a
              href="#downloads"
              className="flex items-center gap-1.5 px-4 py-2 bg-stone-950 hover:bg-stone-800 text-white font-black text-xs sm:text-sm border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Download className="w-4 h-4 stroke-[3]" />
              <span>Download App</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 pt-12 sm:pt-20 pb-16 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-7">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FEF08A] border-2 border-black rounded-full text-xs font-black shadow-[2px_2px_0px_0px_#000]"
          >
            <DotCompanyLogo size={16} variant="icon" />
            <span>Built with Care by .dot for Focused Students & Creators</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-stone-950 tracking-tight leading-[1.1]"
          >
            Study Smarter with{' '}
            <span className="relative inline-block text-emerald-700 underline decoration-black decoration-wavy decoration-2 sm:decoration-4">
              goPanda
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-stone-700 text-sm sm:text-lg font-medium leading-relaxed"
          >
            A lightweight, native study companion with Pomodoro timers, hourly subject targets, colorful sticky checklists, and an animated panda buddy that floats on top of your screen.
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <a
              href="https://github.com/cser-utkarsh-raj/goPanda/releases/latest/download/goPanda-Setup.exe"
              download="goPanda-Setup.exe"
              className="flex items-center gap-2.5 px-6 sm:px-8 py-4 bg-emerald-400 hover:bg-emerald-500 text-stone-950 font-black text-base border-3 border-black rounded-2xl shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Download className="w-5 h-5 stroke-[3]" />
              <span>Download for Windows (.exe)</span>
            </a>

            <a
              href="#downloads"
              className="flex items-center gap-2 px-6 py-4 bg-white hover:bg-stone-50 text-stone-950 font-black text-base border-3 border-black rounded-2xl shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <span>Mac & Linux Downloads</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </a>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-black text-stone-700 pt-2">
            <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-xl border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              <Zap className="w-4 h-4 text-amber-500" /> Ultra-Light Native App
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-xl border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              <Cpu className="w-4 h-4 text-emerald-600" /> &lt;25 MB RAM
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-xl border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              <ShieldCheck className="w-4 h-4 text-teal-600" /> 100% Offline & Private
            </span>
          </div>

          {/* Cute Interactive Animated App Mascot & Preview Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-10 max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-[32px] border-3 border-black shadow-[10px_10px_0px_0px_#000] p-5 sm:p-8 text-left relative overflow-hidden">
              {/* Window Bar */}
              <div className="flex items-center justify-between border-b-2 border-stone-200 pb-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-rose-400 border border-black" />
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-black" />
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 border border-black" />
                  <span className="text-xs font-black text-stone-900 ml-2">goPanda Workspace Preview</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-black text-teal-900 bg-teal-100 px-2.5 py-0.5 rounded-full border border-black">
                  <DotCompanyLogo size={13} variant="icon" />
                  <span>.dot Edition</span>
                </div>
              </div>

              {/* 3-Column Visual Layout Showcase */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                {/* Column 1: Full Cute Mascot & Timer Display */}
                <div className="md:col-span-4 bg-[#F0FDF4] border-2 border-black rounded-2xl p-5 flex flex-col items-center justify-between text-center shadow-[3px_3px_0px_0px_#000] space-y-4">
                  <div className="py-2">
                    <PandaMascot mood="happy" size="md" speechText="Let’s study together! 🎋" />
                  </div>
                  <div className="w-full space-y-2">
                    <div className="text-3xl font-black text-stone-950 font-mono tracking-tight">
                      25:00
                    </div>
                    <div className="flex justify-center gap-1.5">
                      <span className="px-2.5 py-1 bg-emerald-300 border border-black rounded-lg text-[11px] font-black">
                        Pomodoro
                      </span>
                      <span className="px-2.5 py-1 bg-stone-100 border border-black rounded-lg text-[11px] font-bold text-stone-600">
                        Stopwatch
                      </span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Subject Time Targets */}
                <div className="md:col-span-4 bg-stone-50 border-2 border-black rounded-2xl p-4.5 space-y-3 shadow-[3px_3px_0px_0px_#000]">
                  <div className="flex items-center justify-between text-xs font-black text-stone-900 border-b border-stone-200 pb-2">
                    <span>Study Goals & Subtasks</span>
                    <span className="text-emerald-700 font-mono font-bold">1h / 3h done</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2.5 bg-white rounded-xl border border-black shadow-[1.5px_1.5px_0px_0px_#000] flex items-center justify-between">
                      <div>
                        <div className="font-black text-xs text-stone-950">Physics Revision</div>
                        <div className="text-[10px] text-stone-500 font-bold">Target: 1h 00m</div>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded border border-black">
                        Active
                      </span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-black shadow-[1.5px_1.5px_0px_0px_#000] flex items-center justify-between">
                      <div>
                        <div className="font-black text-xs text-stone-950">Problem Solving</div>
                        <div className="text-[10px] text-stone-500 font-bold">Target: 1h 30m</div>
                      </div>
                      <span className="text-stone-400 text-xs font-mono">00:00</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-black shadow-[1.5px_1.5px_0px_0px_#000] flex items-center justify-between">
                      <div>
                        <div className="font-black text-xs text-stone-950">Formula Notes</div>
                        <div className="text-[10px] text-stone-500 font-bold">Target: 30m</div>
                      </div>
                      <span className="text-stone-400 text-xs font-mono">00:00</span>
                    </div>
                  </div>
                </div>

                {/* Column 3: Sticky Checklists */}
                <div className="md:col-span-4 bg-stone-50 border-2 border-black rounded-2xl p-4.5 space-y-3 shadow-[3px_3px_0px_0px_#000]">
                  <div className="flex items-center justify-between text-xs font-black text-stone-900 border-b border-stone-200 pb-2">
                    <span>Sticky Checklists</span>
                    <span className="px-2 py-0.5 bg-[#FEF08A] border border-black rounded text-[10px] font-black">
                      Pinned
                    </span>
                  </div>
                  <div className="p-3 bg-[#FEF08A] rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_#000] space-y-2">
                    <div className="font-black text-xs text-stone-950">Today's Action Items</div>
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                      <span className="line-through opacity-70">Complete lecture notes</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                      <div className="w-3.5 h-3.5 rounded border border-black bg-white shrink-0" />
                      <span>Solve practice set 3.2</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                      <div className="w-3.5 h-3.5 rounded border border-black bg-white shrink-0" />
                      <span>Review active recall cards</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-4 sm:px-8 py-20 bg-white border-y-3 border-black">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="px-3.5 py-1 bg-emerald-200 border border-black rounded-full text-xs font-black uppercase">
              Carefully Crafted for Focus
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-950 tracking-tight">
              Features You'll Actually Use Every Day
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto font-medium">
              No endless settings or distractions. Pure, refined productivity tools built by .dot.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Feature 1 */}
            <div className="p-6 bg-[#F0FDF4] border-3 border-black rounded-3xl shadow-[5px_5px_0px_0px_#000] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-400 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                <Clock className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-black text-lg text-stone-950">Dual Mode Timer</h3>
              <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed">
                Work with structured Pomodoro intervals (25m focus / 5m break) or a continuous stopwatch for unbounded deep study.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-[#FEF08A] border-3 border-black rounded-3xl shadow-[5px_5px_0px_0px_#000] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-yellow-400 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                <Layers className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-black text-lg text-stone-950">Subtasks & Hourly Goals</h3>
              <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed">
                Set individual time targets for multiple subjects with individual logging, remaining time indicators, and progress bars.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-teal-50 border-3 border-black rounded-3xl shadow-[5px_5px_0px_0px_#000] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-300 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                <StickyNote className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-black text-lg text-stone-950">Sticky Checklists & Notes</h3>
              <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed">
                Post-it styled scratchpads with color tags, checklist checkboxes, item counts, and one-click pin-to-top organization.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-amber-50 border-3 border-black rounded-3xl shadow-[5px_5px_0px_0px_#000] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-300 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                <Maximize2 className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-black text-lg text-stone-950">Always-On-Top Mini Widget</h3>
              <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed">
                Pop out a compact, borderless panda circle that stays pinned on top of browser windows, PDF readers, and code editors.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-rose-50 border-3 border-black rounded-3xl shadow-[5px_5px_0px_0px_#000] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-300 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                <Volume2 className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-black text-lg text-stone-950">Calming Bamboo Audio</h3>
              <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed">
                Wooden bamboo click tactile sounds, completion chimes, and cheer cues that provide immediate focus feedback.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-purple-50 border-3 border-black rounded-3xl shadow-[5px_5px_0px_0px_#000] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-300 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                <ShieldCheck className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-black text-lg text-stone-950">Offline & Fast Engine</h3>
              <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed">
                Zero signups, zero tracking, and zero internet connection required. All session histories remain safely on your device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Performance & Architecture Comparison */}
      <section id="compare" className="px-4 sm:px-8 py-20 bg-[#F0FDF4]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-stone-950">
              Engineered for Pure Performance
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">
              Why goPanda by .dot is built with native WebView2 instead of bloated Electron wrappers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Old Heavy Apps */}
            <div className="bg-white p-7 rounded-3xl border-2 border-stone-300 space-y-4 text-stone-600">
              <div className="font-black text-stone-500 text-sm uppercase">Standard Desktop Apps</div>
              <ul className="space-y-3 text-xs sm:text-sm">
                <li className="flex items-center gap-2.5">❌ 100MB+ bulky installer download</li>
                <li className="flex items-center gap-2.5">❌ 150MB - 350MB idle RAM memory usage</li>
                <li className="flex items-center gap-2.5">❌ Bundles a redundant Chromium browser copy</li>
                <li className="flex items-center gap-2.5">❌ Heavy CPU and laptop battery drain</li>
              </ul>
            </div>

            {/* goPanda */}
            <div className="bg-white p-7 rounded-3xl border-3 border-black shadow-[6px_6px_0px_0px_#000] space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-black text-stone-950 text-base uppercase flex items-center gap-2">
                  <span>goPanda</span>
                  <span className="px-2 py-0.5 bg-emerald-300 border border-black rounded text-[10px] font-black">
                    Native
                  </span>
                </div>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm font-bold text-stone-900">
                <li className="flex items-center gap-2.5">✅ Ultra-compact native installer</li>
                <li className="flex items-center gap-2.5">✅ Minimal memory footprint</li>
                <li className="flex items-center gap-2.5">✅ Instant sub-second launch time</li>
                <li className="flex items-center gap-2.5">✅ Zero laptop battery lag during study marathons</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Downloads Section */}
      <section id="downloads" className="px-4 sm:px-8 py-20 bg-white border-t-3 border-black">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="px-3.5 py-1 bg-[#FEF08A] border border-black rounded-full text-xs font-black uppercase">
            Ready in Seconds
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-stone-950">
            Download goPanda
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-lg mx-auto">
            Choose your operating system to install the standalone desktop app.
          </p>

          {/* OS Switcher */}
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={() => setActiveTab('windows')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black border-2 border-black transition-all ${
                activeTab === 'windows'
                  ? 'bg-emerald-400 shadow-[3px_3px_0px_0px_#000] translate-x-0.5 translate-y-0.5'
                  : 'bg-white hover:bg-stone-100'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Windows</span>
            </button>
            <button
              onClick={() => setActiveTab('mac')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black border-2 border-black transition-all ${
                activeTab === 'mac'
                  ? 'bg-emerald-400 shadow-[3px_3px_0px_0px_#000] translate-x-0.5 translate-y-0.5'
                  : 'bg-white hover:bg-stone-100'
              }`}
            >
              <Apple className="w-4 h-4" />
              <span>macOS</span>
            </button>
            <button
              onClick={() => setActiveTab('linux')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black border-2 border-black transition-all ${
                activeTab === 'linux'
                  ? 'bg-emerald-400 shadow-[3px_3px_0px_0px_#000] translate-x-0.5 translate-y-0.5'
                  : 'bg-white hover:bg-stone-100'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Linux</span>
            </button>
          </div>

          {/* Download Box Card */}
          <div className="bg-[#F0FDF4] p-7 sm:p-10 rounded-3xl border-3 border-black shadow-[8px_8px_0px_0px_#000] max-w-xl mx-auto space-y-5">
            {activeTab === 'windows' && (
              <div className="space-y-4">
                <div className="font-black text-xl text-stone-950">Windows 10 / 11 (64-bit)</div>
                <p className="text-xs text-stone-700 font-medium">
                  Official NSIS setup installer. Includes Start Menu and Desktop shortcuts with the custom panda logo.
                </p>
                <a
                  href="https://github.com/cser-utkarsh-raj/goPanda/releases/latest/download/goPanda-Setup.exe"
                  download="goPanda-Setup.exe"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-stone-950 hover:bg-stone-800 text-white font-black text-sm sm:text-base border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  <Download className="w-5 h-5 stroke-[3]" />
                  <span>Download goPanda-Setup.exe</span>
                </a>
              </div>
            )}

            {activeTab === 'mac' && (
              <div className="space-y-4">
                <div className="font-black text-xl text-stone-950">macOS (Apple Silicon & Intel)</div>
                <p className="text-xs text-stone-700 font-medium">
                  Universal `.dmg` disk image. Drag goPanda to your Applications folder to run.
                </p>
                <a
                  href="https://github.com/cser-utkarsh-raj/goPanda/releases/latest/download/goPanda.dmg"
                  download="goPanda.dmg"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-stone-950 hover:bg-stone-800 text-white font-black text-sm sm:text-base border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  <Download className="w-5 h-5 stroke-[3]" />
                  <span>Download goPanda.dmg</span>
                </a>
              </div>
            )}

            {activeTab === 'linux' && (
              <div className="space-y-4">
                <div className="font-black text-xl text-stone-950">Linux (AppImage / DEB)</div>
                <p className="text-xs text-stone-700 font-medium">
                  Standalone executable package for Ubuntu, Fedora, Debian, Arch & all distributions.
                </p>
                <a
                  href="https://github.com/cser-utkarsh-raj/goPanda/releases/latest/download/goPanda.AppImage"
                  download="goPanda.AppImage"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-stone-950 hover:bg-stone-800 text-white font-black text-sm sm:text-base border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  <Download className="w-5 h-5 stroke-[3]" />
                  <span>Download goPanda.AppImage</span>
                </a>
                <div className="pt-1">
                  <a
                    href="https://github.com/cser-utkarsh-raj/goPanda/releases/latest/download/goPanda.deb"
                    download="goPanda.deb"
                    className="text-xs font-black text-stone-800 underline hover:text-emerald-700 transition-colors"
                  >
                    Download Debian / Ubuntu .deb package
                  </a>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-stone-200 text-center">
              <a
                href="https://github.com/cser-utkarsh-raj/goPanda/releases/latest"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-black text-stone-700 hover:text-stone-950 underline decoration-stone-400"
              >
                <span>Browse all builds & checksums on GitHub Releases</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-3 border-black bg-stone-950 text-white py-12 px-4 sm:px-8 text-center text-xs">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-left">
            <div className="w-12 h-12 bg-white rounded-2xl border-2 border-stone-800 flex items-center justify-center shrink-0">
              <DotCompanyLogo size={36} variant="badge" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-black text-base text-white">
                <span>goPanda</span>
                <span className="text-teal-400 font-bold text-xs bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                  by .dot
                </span>
              </div>
              <div className="text-stone-400 text-xs mt-0.5 font-medium">
                Crafted for Deep Focus & Habit Building
              </div>
            </div>
          </div>

          <div className="text-stone-400 font-medium text-xs sm:text-right">
            <div>© {new Date().getFullYear()} .dot. All rights reserved.</div>
            <div className="text-stone-500 text-[11px] mt-0.5">Ultra-Lightweight Desktop Productivity Engine</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
