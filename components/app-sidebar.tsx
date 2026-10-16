"use client";

import {
  ArrowUpRight,
  LayoutDashboard,
  MessageSquareText,
  Sparkles,
  X,
} from "lucide-react";

type AppSidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col p-5">
      <a
        href="#workspace"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-xl"
      >
        <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/20">
          <Sparkles size={21} />
        </div>

        <div>
          <p className="font-semibold tracking-tight text-white">
            ClientBrief AI
          </p>
          <p className="text-xs text-slate-400">Client intelligence</p>
        </div>
      </a>

      <div className="mt-10">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Workspace
        </p>

        <a
          href="#workspace"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl border border-violet-400/20 bg-violet-400/10 px-3 py-3 text-sm font-medium text-violet-200"
        >
          <LayoutDashboard size={18} />
          Message analyzer
        </a>

        <div className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400">
          <MessageSquareText size={18} />
          Client insights
          <span className="ml-auto text-[10px] text-slate-600">Soon</span>
        </div>
      </div>

      <div className="mt-auto rounded-2xl border border-white/8 bg-white/3 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <Sparkles size={15} className="text-violet-300" />
          Built for better conversations
        </div>

        <p className="mt-2 text-xs leading-5 text-slate-400">
          Turn incoming client messages into clear requirements and actionable
          next steps.
        </p>

        <a
          href="#workspace"
          onClick={onNavigate}
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-violet-300 transition hover:text-violet-200"
        >
          Open workspace
          <ArrowUpRight size={13} />
        </a>
      </div>

      <p className="mt-5 text-[10px] text-slate-600">ClientBrief AI · V1</p>
    </div>
  );
}

export default function AppSidebar({ mobileOpen, onClose }: AppSidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-white/8 bg-[#0b0f1b] lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 size-full cursor-default bg-black/65 backdrop-blur-sm"
            onClick={onClose}
          />

          <aside
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="absolute inset-y-0 left-0 flex h-full w-70 max-w-[85vw] flex-col border-r border-white/10 bg-[#0b0f1b] shadow-2xl"
          >
            <div className="flex justify-end px-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="min-h-0 flex-1">
              <SidebarContent onNavigate={onClose} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
