import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("VITE_GEMINI_API_KEY is not defined in the environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export interface ChatMessage {
  role: 'user' | 'model' | 'error';
  text: string;
}

export interface WritingEvaluation {
  band_score: number;
  breakdown: {
    TR: number;
    CC: number;
    LR: number;
    GRA: number;
  };
  feedback: string;
  corrections: Array<{
    original: string;
    correction: string;
    reason: string;
  }>;
}

export interface SpeakingEvaluation {
  band_score: number;
  feedback: string;
  better_vocabulary: string[];
}

export const sendMessageToGemini = async (prompt: string): Promise<string> => {
  try {
    if (!API_KEY) {
      throw new Error("API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `Sorry, I encountered an error: ${error.message || "Unknown error"}`;
  }
};

export const evaluateWriting = async (topic: string, essay: string): Promise<WritingEvaluation> => {
  const prompt = `Act as a strict IELTS Examiner. Evaluate the following essay for a given topic.
  Topic: "${topic}"
  Essay: "${essay}"
  
  Evaluate based on: Task Response (TR), Coherence & Cohesion (CC), Lexical Resource (LR), Grammatical Range & Accuracy (GRA).
  
  Return a JSON object STRICTLY with this structure:
  {
    "band_score": 6.5,
    "breakdown": { "TR": 6, "CC": 7, "LR": 6, "GRA": 7 },
    "feedback": "...",
    "corrections": [
      { "original": "...", "correction": "...", "reason": "..." }
    ]
  }
  Do not include any other text before or after the JSON.`;

  try {
    const responseText = await sendMessageToGemini(prompt);
    // Clean potential markdown prefix/suffix
    const cleanJson = responseText.replace(/```json|```/gi, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Writing Evaluation Error:", error);
    throw error;
  }
};

export const evaluateSpeaking = async (question: string, transcript: string): Promise<SpeakingEvaluation> => {
  const prompt = `Act as an IELTS Speaking Examiner. Evaluate the following response.
  Question: "${question}"
  Transcript: "${transcript}"
  
  Return a JSON object STRICTLY with this structure:
  {
    "band_score": 7.0,
    "feedback": "...",
    "better_vocabulary": ["...", "..."]
  }
  Do not include any other text before or after the JSON.`;

  try {
    const responseText = await sendMessageToGemini(prompt);
    const cleanJson = responseText.replace(/```json|```/gi, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Speaking Evaluation Error:", error);
    throw error;
  }
};
