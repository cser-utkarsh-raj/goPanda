import React from 'react';
import { DotCompanyLogo } from './DotCompanyLogo';

const REPO_URL = 'https://github.com/cser-utkarsh-raj/goPanda';
const RELEASES_URL = 'https://github.com/cser-utkarsh-raj/goPanda/releases';
const LICENSE_URL = 'https://github.com/cser-utkarsh-raj/goPanda/blob/main/LICENSE';

export function DotFooter() {
  return (
    <footer className="shrink-0 w-full border-t border-slate-200/90 bg-white/95 backdrop-blur-sm px-4 sm:px-6 py-2.5 grid grid-cols-1 md:grid-cols-3 items-center gap-2.5 text-slate-500 text-xs shadow-sm">
      <div className="flex items-center justify-center md:justify-start gap-2 order-2 md:order-1">
        <span className="font-semibold text-slate-700">goPanda</span>
        <span className="text-slate-300">•</span>
        <span className="text-slate-500">© {new Date().getFullYear()} All rights reserved.</span>
      </div>

      <div className="flex items-center justify-center gap-2 order-1 md:order-2">
        <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-slate-400">
          Presented by
        </span>
        <span className="flex items-center gap-1.5 text-[13px] font-black tracking-tight text-[#1E1E24]">
          <DotCompanyLogo size={22} variant="icon" />
          <span>.dot</span>
        </span>
      </div>

      <nav className="flex items-center justify-center md:justify-end gap-4 sm:gap-5 text-[11px] font-medium text-slate-600 order-3">
        <a href={REPO_URL} target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors">
          GitHub
        </a>
        <a href={RELEASES_URL} target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors">
          Releases
        </a>
        <a href={LICENSE_URL} target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors">
          License
        </a>
      </nav>
    </footer>
  );
}
