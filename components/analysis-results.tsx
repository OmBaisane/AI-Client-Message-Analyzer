"use client";

import {
  AlertCircle,
  Check,
  Clipboard,
  FileText,
  ListChecks,
  MessageSquareText,
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
    `Estimated urgency: ${result.urgency}`,
    "",
    "Requirements:",
    ...(result.requirements.length
      ? result.requirements.map((item) => `- ${item}`)
      : ["- No explicit requirements identified."]),
    "",
    "Missing information to clarify:",
    ...(result.missingInformation.length
      ? result.missingInformation.map((item) => `- ${item}`)
      : ["- No major gaps identified by AI."]),
    "",
    "Suggested reply:",
    result.suggestedReply,
    "",
    "Suggested action items:",
    ...(result.actionItems.length
      ? result.actionItems.map((item) => `- ${item}`)
      : ["- No action items suggested."]),
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

          <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-400">
            {result.requirements.length}
          </span>
        </div>

        {result.requirements.length > 0 ? (
          <ul className="mt-5 space-y-3">
            {result.requirements.map((item, index) => (
              <li
                key={`${index}-${item}`}
                className="flex items-start gap-3 text-sm leading-6 text-slate-300"
              >
                <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                  <Check size={12} />
                </span>
                <span className="min-w-0 wrap-break-words">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 text-sm leading-6 text-slate-400">
            No explicit requirements were identified in the message.
          </p>
        )}
      </article>

      <article className="rounded-2xl border border-amber-400/15 bg-[#101522] p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <AlertCircle size={17} className="text-amber-300" />
          <h3 className="text-sm font-semibold text-white">
            Missing information
          </h3>
          <span className="ml-auto rounded-full bg-amber-400/10 px-2.5 py-1 text-xs text-amber-200">
            {result.missingInformation.length}
          </span>
        </div>

        {result.missingInformation.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {result.missingInformation.map((item, index) => (
              <li
                key={`${index}-${item}`}
                className="flex items-start gap-3 text-sm leading-6 text-slate-300"
              >
                <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-amber-300">
                  <AlertCircle size={12} />
                </span>
                <span className="min-w-0 wrap-break-words">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm leading-6 text-slate-400">
            No major information gaps were identified. Review the brief before
            confirming the scope.
          </p>
        )}
      </article>

      <article className="rounded-2xl border border-white/8 bg-[#101522] p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <MessageSquareText size={17} className="text-violet-300" />
          <h3 className="text-sm font-semibold text-white">
            Suggested client reply
          </h3>
        </div>

        <p className="mt-4 whitespace-pre-wrap wrap-break-words text-sm leading-7 text-slate-300">
          {result.suggestedReply}
        </p>

        <button
          type="button"
          onClick={() => onCopy(result.suggestedReply, "reply")}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/6 hover:text-white"
        >
          {copiedLabel === "reply" ? (
            <Check size={14} />
          ) : (
            <Clipboard size={14} />
          )}
          {copiedLabel === "reply" ? "Copied" : "Copy reply"}
        </button>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          Review and edit this draft before sending it to your client.
        </p>
      </article>

      <article className="rounded-2xl border border-white/8 bg-[#101522] p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <ListChecks size={17} className="text-violet-300" />
          <h3 className="text-sm font-semibold text-white">
            Suggested action items
          </h3>
          <span className="ml-auto rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-400">
            {result.actionItems.length}
          </span>
        </div>

        {result.actionItems.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {result.actionItems.map((item, index) => (
              <li
                key={`${index}-${item}`}
                className="flex items-start gap-3 text-sm leading-6 text-slate-300"
              >
                <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-violet-400/10 text-violet-300">
                  <Check size={12} />
                </span>
                <span className="min-w-0 wrap-break-words">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-slate-400">
            No action items were suggested.
          </p>
        )}

        <div className="mt-5 rounded-xl border border-white/6 bg-white/2 p-3">
          <p className="text-xs leading-5 text-slate-400">
            AI-generated suggestions may be inaccurate. Confirm requirements
            with the client before committing to scope, price, or deadlines.
          </p>
        </div>
      </article>
    </section>
  );
}
