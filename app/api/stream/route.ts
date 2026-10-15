import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const message = body.message;
    const conversation = body.conversation;

    // Validate current message
    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 },
      );
    }

    // Validate conversation
    if (
      conversation !== undefined &&
      (!Array.isArray(conversation) ||
        !conversation.every(
          (item: unknown) =>
            typeof item === "object" &&
            item !== null &&
            "role" in item &&
            "content" in item &&
            (item.role === "user" || item.role === "assistant") &&
            typeof item.content === "string",
        ))
    ) {
      return NextResponse.json(
        { error: "Invalid conversation context." },
        { status: 400 },
      );
    }

    const history: ConversationMessage[] = conversation ?? [];

    const conversationText = history
      .map((item) => `${item.role}: ${item.content}`)
      .join("\n");

    const prompt = `
You are a helpful AI assistant for a developer learning AI-powered full-stack development.

Use the conversation context when it is relevant.

Conversation context:
${conversationText || "No previous conversation."}

Current user message:
${message}

Answer the user's current message clearly and naturally.
Do not invent information that is not supported by the conversation.
`;

    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }

          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("AI streaming error:", error);

    const apiError = error as {
      status?: number;
      message?: string;
    };

    return NextResponse.json(
      {
        error: apiError.message || "Failed to generate AI response.",
        status: apiError.status || 500,
      },
      {
        status: apiError.status || 500,
      },
    );
  }
}
