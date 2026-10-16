"use client";

import {
  AlertCircle,
  Check,
  Clipboard,
  FileText,
  ListChecks,
  Sparkles,
} from "lucide-react";

import type { AnalysisResult } from "@/lib/types";

type AnalysisResultsProps = {
  result: AnalysisResult;
  onCopy: (text: string, label: string) => void;
  copiedLabel: string | null;
};

export default function AnalysisResults({
  result,
  onCopy,
  copiedLabel,
}: AnalysisResultsProps) {
  const urgencyStyles = {
    Low: "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300",
    Medium: "border-amber-400/20 bg-amber-400/[0.07] text-amber-300",
    High: "border-rose-400/20 bg-rose-400/[0.07] text-rose-300",
  };

  const briefText = [
    `Project type: ${result.projectType}`,
    `Urgency: ${result.urgency}`,
    "",
    "Requirements:",
    ...(result.requirements.length
      ? result.requirements.map((requirement) => `- ${requirement}`)
      : ["- No explicit requirements identified."]),
  ].join("\n");

  return (
    <section aria-labelledby="analysis-results-heading" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-violet-300">
            <Sparkles size={16} />
            <span className="text-xs font-medium uppercase tracking-[0.15em]">
              AI analysis
            </span>
          </div>

          <h2
            id="analysis-results-heading"
            className="mt-2 text-xl font-semibold tracking-tight text-white"
          >
            Project insights
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            A structured view of the client&apos;s request.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onCopy(briefText, "brief")}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
        >
          {copiedLabel === "brief" ? (
            <Check size={14} />
          ) : (
            <Clipboard size={14} />
          )}
          {copiedLabel === "brief" ? "Copied" : "Copy brief"}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <article className="rounded-2xl border border-white/8 bg-[#101522] p-5">
          <div className="flex items-center gap-2 text-slate-400">
            <FileText size={15} />
            <span className="text-xs">Project type</span>
          </div>

          <p className="mt-4 wrap-break-words text-lg font-semibold text-white">
            {result.projectType || "Not identified"}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Based on the client&apos;s message
          </p>
        </article>

        <article className="rounded-2xl border border-white/8 bg-[#101522] p-5">
          <div className="flex items-center gap-2 text-slate-400">
            <AlertCircle size={15} />
            <span className="text-xs">Estimated urgency</span>
          </div>

          <div className="mt-4">
            <span
              className={`inline-flex rounded-full border px-3 py-1.5 text-sm font-medium ${urgencyStyles[result.urgency]}`}
            >
              {result.urgency}
            </span>
          </div>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            An AI estimate, not a confirmed client deadline.
          </p>
        </article>
      </div>

      <article className="rounded-2xl border border-white/8 bg-[#101522] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ListChecks size={17} className="text-violet-300" />
            <h3 className="text-sm font-semibold text-white">
              Extracted requirements
            </h3>
          </div>

          <span className="rounded-full bg-white/05 px-2.5 py-1 text-xs text-slate-400">
            {result.requirements.length}
          </span>
        </div>

        {result.requirements.length > 0 ? (
          <ul className="mt-5 space-y-3">
            {result.requirements.map((requirement, index) => (
              <li
                key={`${index}-${requirement}`}
                className="flex items-start gap-3 text-sm leading-6 text-slate-300"
              >
                <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                  <Check size={12} />
                </span>
                <span className="min-w-0 break-words">{requirement}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 text-sm leading-6 text-slate-400">
            No explicit requirements were identified in the message.
          </p>
        )}

        <div className="mt-5 flex items-start gap-2 rounded-xl border border-white/6 bg-white/2 p-3">
          <Sparkles size={14} className="mt-0.5 shrink-0 text-violet-300" />
          <p className="text-xs leading-5 text-slate-400">
            Confirm unclear requirements with the client before finalizing
            scope, price, or deadlines.
          </p>
        </div>
      </article>
    </section>
  );
}
