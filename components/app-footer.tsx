import { ShieldAlert } from "lucide-react";

export default function AppFooter() {
  return (
    <footer className="mt-auto border-t border-white/[0.07] px-5 py-5 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>ClientBrief AI · Built for clearer client conversations.</p>

        <p className="inline-flex items-start gap-2 sm:max-w-md sm:justify-end sm:text-right">
          <ShieldAlert size={14} className="mt-0.5 shrink-0" />
          Review AI-generated insights before confirming scope, pricing, or
          deadlines.
        </p>
      </div>
    </footer>
  );
}
