"use client";

import { useState } from "react";

import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import AnalysisResults from "@/components/analysis-results";
import AppSidebar from "@/components/app-sidebar";
import FollowUpChat from "@/components/follow-up-chat";
import MessageInput from "@/components/message-input";

import type { AnalysisResult, ConversationMessage } from "@/lib/types";

export default function Page() {
  const [message, setMessage] = useState("");
  const [followUpInput, setFollowUpInput] = useState("");

  const [result, setResult] = useState<AnalysisResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);

  const [streamedText, setStreamedText] = useState("");
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);

  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const busy = loading || streaming;

  async function handleAnalyze() {
    if (!message.trim()) {
      setAnalysisError("Please enter a client message first.");
      return;
    }

    setLoading(true);
    setAnalysisError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message.trim(),
        }),
      });

      const data: {
        result?: AnalysisResult;
        error?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze the message.");
      }

      if (
        !data.result ||
        typeof data.result.projectType !== "string" ||
        !["Low", "Medium", "High"].includes(data.result.urgency) ||
        !Array.isArray(data.result.requirements) ||
        !data.result.requirements.every(
          (requirement) => typeof requirement === "string",
        )
      ) {
        throw new Error("The analysis response was invalid. Please try again.");
      }

      setResult(data.result);
    } catch (error) {
      setAnalysisError(
        error instanceof Error
          ? error.message
          : "Something went wrong while analyzing the message.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleStream() {
    const userMessage = followUpInput.trim();

    if (!userMessage) {
      setChatError("Enter a follow-up question first.");
      return;
    }

    setStreaming(true);
    setChatError(null);
    setStreamedText("");

    try {
      const context: ConversationMessage[] = [
        ...(message.trim()
          ? [{ role: "user" as const, content: message.trim() }]
          : []),
        ...conversation,
      ];

      const response = await fetch("/api/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversation: context,
        }),
      });

      if (!response.ok) {
        const data: { error?: string } | null = await response
          .json()
          .catch(() => null);

        throw new Error(data?.error || "Failed to generate a response.");
      }

      if (!response.body) {
        throw new Error("Streaming is not available in this response.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let assistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        assistantMessage += decoder.decode(value, { stream: true });
        setStreamedText(assistantMessage);
      }

      assistantMessage += decoder.decode();

      setConversation((current) => [
        ...current,
        { role: "user", content: userMessage },
        {
          role: "assistant",
          content: assistantMessage || "No response was generated.",
        },
      ]);

      setFollowUpInput("");
      setStreamedText(assistantMessage);
    } catch (error) {
      setChatError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setStreaming(false);
    }
  }

  async function copyText(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLabel(label);

      window.setTimeout(() => {
        setCopiedLabel((current) => (current === label ? null : current));
      }, 1800);
    } catch {
      setAnalysisError(
        "Clipboard access failed. Please select and copy the text manually.",
      );
    }
  }

  function resetWorkspace() {
    if (busy) {
      return;
    }

    setMessage("");
    setFollowUpInput("");
    setResult(null);
    setStreamedText("");
    setConversation([]);
    setAnalysisError(null);
    setChatError(null);
    setCopiedLabel(null);
  }

  return (
    <div
      id="workspace"
      className="flex min-h-screen bg-[#080b14] text-slate-100"
    >
      <AppSidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AppHeader onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <section className="mb-8 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-400/6 px-3 py-1.5 text-xs font-medium text-violet-200">
              <span className="size-1.5 rounded-full bg-violet-300" />
              From client message to clear next steps
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
              Understand the request.
              <span className="mt-1 block bg-linear-to-r from-violet-300 via-indigo-200 to-sky-200 bg-clip-text text-transparent">
                Plan the next move.
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Turn unstructured client messages into organized project
              requirements, an urgency estimate, and clearer follow-up
              conversations.
            </p>
          </section>

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
            <div className="min-w-0 space-y-6">
              <MessageInput
                message={message}
                onMessageChange={setMessage}
                onAnalyze={handleAnalyze}
                onReset={resetWorkspace}
                loading={loading}
                error={analysisError}
              />

              {result && (
                <AnalysisResults
                  result={result}
                  onCopy={copyText}
                  copiedLabel={copiedLabel}
                />
              )}
            </div>

            <div className="min-w-0 xl:sticky xl:top-25">
              <FollowUpChat
                conversation={conversation}
                followUpInput={followUpInput}
                onFollowUpInputChange={setFollowUpInput}
                onSubmit={handleStream}
                streamedText={streamedText}
                streaming={streaming}
                error={chatError}
              />
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/2 px-4 py-4 sm:px-5">
            <p className="text-xs leading-6 text-slate-400">
              <span className="font-medium text-slate-300">
                Keep control of the decisions.
              </span>{" "}
              ClientBrief AI helps organize the information you provide. Always
              confirm ambiguous requirements, final project scope, pricing, and
              deadlines with the client yourself.
            </p>
          </div>
        </main>

        <AppFooter />
      </div>
    </div>
  );
}
