export type Urgency = "Low" | "Medium" | "High";

export type AnalysisResult = {
  projectType: string;
  urgency: Urgency;
  requirements: string[];
  missingInformation: string[];
  suggestedReply: string;
  actionItems: string[];
};

export type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};
