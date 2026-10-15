import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const analyzerSchema = {
  type: "object",
  properties: {
    projectType: {
      type: "string",
      description: "The type of project explicitly mentioned by the client.",
    },
    urgency: {
      type: "string",
      enum: ["Low", "Medium", "High"],
      description: "Urgency based only on information provided by the client.",
    },
    requirements: {
      type: "array",
      items: {
        type: "string",
      },
      description: "Requirements explicitly mentioned by the client.",
    },
  },
  required: ["projectType", "urgency", "requirements"],
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const message = body.message;

    // Validate user input
    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Client message is required." },
        { status: 400 },
      );
    }

    // Ask AI for structured analysis
    const response = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: `
Analyze this client message.

Task:
- Identify the project type.
- Identify the urgency.
- Extract the requirements.

Rules:
- Only use information explicitly provided by the client.
- Do not invent requirements.
- Do not assume missing information.
- If something is not mentioned, do not add it.

Client message:
${message}
      `,
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: analyzerSchema,
      },
    });

    if (!response.output_text) {
      return NextResponse.json(
        { error: "AI returned an empty response." },
        { status: 500 },
      );
    }

    const result = JSON.parse(response.output_text);

    // Validate AI output
    if (
      typeof result.projectType !== "string" ||
      !["Low", "Medium", "High"].includes(result.urgency) ||
      !Array.isArray(result.requirements) ||
      !result.requirements.every(
        (requirement: unknown) => typeof requirement === "string",
      )
    ) {
      return NextResponse.json(
        { error: "AI returned invalid analysis." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      result,
    });
  } catch (error) {
    console.error("AI analysis error:", error);

    return NextResponse.json(
      { error: "Failed to analyze client message." },
      { status: 500 },
    );
  }
}
