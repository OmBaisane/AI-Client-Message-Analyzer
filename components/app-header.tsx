"use client";

import { Menu, Sparkles } from "lucide-react";

type AppHeaderProps = {
  onMenuClick: () => void;
};

export default function AppHeader({ onMenuClick }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[#080b14]/85 backdrop-blur-xl">
      <div className="flex min-h-19 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            aria-controls="mobile-navigation"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/3 text-slate-300 transition hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <p className="text-xs text-slate-500">Workspace</p>
            <h1 className="truncate text-sm font-semibold text-slate-100 sm:text-base">
              Client message analyzer
            </h1>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-violet-400/15 bg-violet-400/6 px-3 py-2 sm:flex">
          <Sparkles size={14} className="text-violet-300" />
          <span className="text-xs font-medium text-slate-300">
            AI-assisted workflow
          </span>
        </div>
      </div>
    </header>
  );
}
