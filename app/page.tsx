"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<{
    projectType: string;
    urgency: string;
    requirements: string[];
  } | null>(null);

  const [streamedText, setStreamedText] = useState("");
  const [streaming, setStreaming] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [conversation, setConversation] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  const handleAnalyze = async () => {
    if (!message.trim()) {
      alert("Please enter a client message.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setResult(data.result);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to analyze client message.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStream = async () => {
    if (!message.trim()) {
      setError("Please enter a message.");
      return;
    }

    setError("");
    setStreamedText("");
    setStreaming(true);

    const userMessage = message.trim();

    try {
      const response = await fetch("/api/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversation,
        }),
      });

      console.log(
        "STREAM RESPONSE:",
        response.status,
        response.statusText,
        response.ok,
        response.headers.get("content-type"),
      );

      // Error only when response is NOT successful
      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(data?.error || "Failed to generate AI response.");
      }

      if (!response.body) {
        throw new Error("Streaming is not supported.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let assistantResponse = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        assistantResponse += chunk;

        setStreamedText(assistantResponse);
      }

      // Save both sides of the conversation
      setConversation((current) => [
        ...current,
        {
          role: "user",
          content: userMessage,
        },
        {
          role: "assistant",
          content: assistantResponse,
        },
      ]);

      setMessage("");
    } catch (error) {
      console.error("FRONTEND STREAM ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate AI response.",
      );
    } finally {
      setStreaming(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">AI Client Analyzer</h1>

        <p className="mt-2 text-slate-400">Analyze client messages using AI.</p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste client message here..."
          className="mt-6 min-h-40 w-full rounded-lg border border-slate-700 bg-slate-900 p-4 outline-none"
        />

        <button
          type="button"
          onClick={handleAnalyze}
          className="mt-4 rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Message"}
        </button>

        <button
          type="button"
          onClick={handleStream}
          disabled={streaming}
          className="ml-4 rounded-lg bg-purple-600 px-5 py-3 font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          {streaming ? "Streaming" : "Test Streaming"}
        </button>

        {conversation.length > 0 && (
          <div className="mt-6 space-y-4">
            {conversation.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-700 bg-slate-900 p-4"
              >
                <p className="text-sm font-medium text-slate-400">
                  {item.role === "user" ? "You" : "AI"}
                </p>

                <p className="mt-2 whitespace-pre-wrap text-slate-200">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        )}

        {streamedText && (
          <div className="mt-6 rounded-lg border border-purple-500/30 bg-slate-900 p-5">
            <p className="text-sm font-medium text-purple-400">AI</p>

            <p className="mt-2 whitespace-pre-wrap text-slate-200">
              {streamedText}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            <p>{error}</p>

            <button
              type="button"
              onClick={handleStream}
              disabled={streaming}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {streaming ? "Retrying..." : "Retry"}
            </button>
          </div>
        )}

        {result && (
          <div className="mt-6 rounded-lg border border-slate-700 bg-slate-900 p-5">
            <h2 className="text-xl font-semibold">Analysis Result</h2>

            <div className="mt-4">
              <p className="text-sm text-slate-400">Project Type</p>
              <p className="mt-1">{result.projectType}</p>
            </div>

            <div className="mt-4">
              <p className="text-sm text-slate-400">Urgency</p>
              <p className="mt-1">{result.urgency}</p>
            </div>

            <div className="mt-4">
              <p className="text-sm text-slate-400">Requirements</p>

              <ul className="mt-2 list-disc space-y-1 pl-5">
                {result.requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
