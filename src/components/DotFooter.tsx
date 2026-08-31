import React from 'react';
import { DotCompanyLogo } from './DotCompanyLogo';

export function DotFooter() {
  return (
    <footer className="w-full flex items-center justify-center gap-2 py-4 text-stone-500 bg-white/70 border-t border-stone-200/80 backdrop-blur-sm">
      <span className="text-[10px] font-medium tracking-[0.16em] uppercase">Presented by</span>
      <span className="flex items-center gap-1.5 text-[13px] font-extrabold tracking-tight text-[#1E1E24]">
        <DotCompanyLogo size={22} variant="icon" />
        <span>.dot</span>
      </span>
    </footer>
  );
}
