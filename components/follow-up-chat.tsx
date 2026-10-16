"use client";

import {
  ArrowUp,
  Bot,
  LoaderCircle,
  MessageCircle,
  UserRound,
} from "lucide-react";

import type { ConversationMessage } from "@/lib/types";

type FollowUpChatProps = {
  conversation: ConversationMessage[];
  followUpInput: string;
  onFollowUpInputChange: (value: string) => void;
  onSubmit: () => void;
  streamedText: string;
  streaming: boolean;
  error: string | null;
};

export default function FollowUpChat({
  conversation,
  followUpInput,
  onFollowUpInputChange,
  onSubmit,
  streamedText,
  streaming,
  error,
}: FollowUpChatProps) {
  const hasConversation = conversation.length > 0;

  return (
    <section
      aria-labelledby="follow-up-heading"
      className="flex min-h-105 flex-col overflow-hidden rounded-2xl border border-white/8 bg-[#101522]"
    >
      <div className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-5 sm:px-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
          <MessageCircle size={17} />
        </div>

        <div>
          <h2
            id="follow-up-heading"
            className="text-sm font-semibold text-white"
          >
            Ask a follow-up
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Explore the client request with AI.
          </p>
        </div>

        <span className="ml-auto rounded-full border border-white/8 px-2.5 py-1 text-[10px] font-medium text-slate-400">
          AI assistant
        </span>
      </div>

      <div
        aria-live="polite"
        aria-relevant="additions text"
        className="min-h-44 flex-1 space-y-4 overflow-y-auto p-5 sm:p-6"
      >
        {!hasConversation && !streaming && (
          <div className="flex min-h-32 flex-col items-center justify-center text-center">
            <div className="flex size-10 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-400/6 text-violet-300">
              <Bot size={20} />
            </div>

            <p className="mt-3 text-sm font-medium text-slate-200">
              Need more clarity?
            </p>

            <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
              Ask about requirements, project scope, or what to clarify next.
            </p>
          </div>
        )}

        {conversation.map((item, index) => (
          <div
            key={`${index}-${item.role}`}
            className={`flex items-start gap-3 ${
              item.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${
                item.role === "assistant"
                  ? "bg-violet-400/10 text-violet-300"
                  : "bg-white/[0.07] text-slate-300"
              }`}
            >
              {item.role === "assistant" ? (
                <Bot size={16} />
              ) : (
                <UserRound size={16} />
              )}
            </div>

            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                item.role === "assistant"
                  ? "border border-white/6 bg-white/2.5 text-slate-300"
                  : "bg-violet-500/15 text-violet-100"
              }`}
            >
              <p className="whitespace-pre-wrap wrap-break-words">
                {item.content}
              </p>
            </div>
          </div>
        ))}

        {streaming && (
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
              <Bot size={16} />
            </div>

            <div className="max-w-[88%] rounded-2xl border border-white/6 bg-white/2.5 px-4 py-3 text-sm leading-6 text-slate-300">
              {streamedText ? (
                <p className="whitespace-pre-wrap wrap-break-word">
                  {streamedText}
                </p>
              ) : (
                <span className="inline-flex items-center gap-2 text-slate-400">
                  <LoaderCircle size={14} className="animate-spin" />
                  Thinking...
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="mx-5 mb-3 rounded-xl border border-rose-400/20 bg-rose-400/6 px-4 py-3 text-sm text-rose-200 sm:mx-6"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
        className="border-t border-white/[0.07] p-4 sm:p-5"
      >
        <label htmlFor="follow-up-message" className="sr-only">
          Ask a follow-up question
        </label>

        <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-[#0b0f1b] p-2 transition focus-within:border-violet-400/40">
          <textarea
            id="follow-up-message"
            value={followUpInput}
            onChange={(event) => onFollowUpInputChange(event.target.value)}
            maxLength={4000}
            rows={2}
            disabled={streaming}
            placeholder="Ask a question about this client request..."
            className="max-h-32 min-h-11 flex-1 resize-y bg-transparent px-2 py-2 text-sm leading-5 text-slate-200 placeholder:text-slate-600 focus:outline-none disabled:opacity-50"
          />

          <button
            type="submit"
            aria-label="Send follow-up"
            disabled={streaming || !followUpInput.trim()}
            className="mb-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-500 text-white transition hover:bg-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {streaming ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <ArrowUp size={18} />
            )}
          </button>
        </div>

        <p className="mt-3 text-center text-[11px] leading-5 text-slate-500">
          AI responses can be inaccurate. Verify important details with the
          client.
        </p>
      </form>
    </section>
  );
}
