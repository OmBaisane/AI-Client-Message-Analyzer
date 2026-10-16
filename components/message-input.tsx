"use client";

import {
  ArrowRight,
  FileText,
  LoaderCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";

type MessageInputProps = {
  message: string;
  onMessageChange: (value: string) => void;
  onAnalyze: () => void;
  onReset: () => void;
  loading: boolean;
  error: string | null;
};

const sampleMessages = [
  {
    label: "Business website",
    message:
      "Hi, I need a modern website for my clothing business. It should have Home, About, Products, and Contact pages. I also need a WhatsApp contact button. Please let me know the estimated cost and timeline.",
  },
  {
    label: "E-commerce store",
    message:
      "Hello, I want an online store for my fashion brand. Customers should be able to browse products, add items to cart, and place orders. I would like an admin panel to manage products and orders. Please share the next steps.",
  },
  {
    label: "Project inquiry",
    message:
      "Hi, I found your portfolio and would like to discuss building a web application for my startup. I have an initial idea but haven't finalized the features or budget yet. Can we discuss the requirements?",
  },
];

export default function MessageInput({
  message,
  onMessageChange,
  onAnalyze,
  onReset,
  loading,
  error,
}: MessageInputProps) {
  return (
    <section
      aria-labelledby="message-input-heading"
      className="overflow-hidden rounded-2xl border border-white/9 bg-[#101522] shadow-[0_16px_60px_rgba(0,0,0,0.12)]"
    >
      <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] px-5 py-5 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-violet-400/10 text-violet-300">
              <FileText size={16} />
            </div>

            <h2
              id="message-input-heading"
              className="text-sm font-semibold text-white"
            >
              Client message
            </h2>
          </div>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            Paste the client&apos;s message to extract project insights.
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          disabled={loading || (!message && !error)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      <div className="p-5 sm:p-6">
        <label htmlFor="client-message" className="sr-only">
          Paste client message
        </label>

        <textarea
          id="client-message"
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
          maxLength={12000}
          rows={7}
          placeholder="Paste a WhatsApp message, email, or project inquiry here..."
          disabled={loading}
          className="min-h-44 w-full rounded-xl border border-white/10 bg-[#0b0f1b] p-4 text-sm leading-6 text-slate-200 placeholder:text-slate-600 transition focus:border-violet-400/50 focus:bg-[#0d1120] focus:outline-none focus:ring-4 focus:ring-violet-500/8 disabled:opacity-60"
        />

        <div className="mt-2 flex justify-end">
          <span className="text-[11px] tabular-nums text-slate-500">
            {message.length.toLocaleString()} / 12,000
          </span>
        </div>

        <div className="mt-5">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.15em] text-slate-500">
            Try a sample
          </p>

          <div className="flex flex-wrap gap-2">
            {sampleMessages.map((sample) => (
              <button
                key={sample.label}
                type="button"
                disabled={loading}
                onClick={() => onMessageChange(sample.message)}
                className="rounded-full border border-white/10 bg-white/2.5 px-3 py-2 text-xs text-slate-400 transition hover:border-violet-400/30 hover:bg-violet-400/[0.07] hover:text-violet-200 disabled:opacity-50"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-rose-400/20 bg-rose-400/6 px-4 py-3 text-sm leading-5 text-rose-200"
          >
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500">
            AI-generated insights should be reviewed before acting.
          </p>

          <button
            type="button"
            onClick={onAnalyze}
            disabled={loading || !message.trim()}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/25 transition hover:bg-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101522] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <LoaderCircle size={16} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Analyze message
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
