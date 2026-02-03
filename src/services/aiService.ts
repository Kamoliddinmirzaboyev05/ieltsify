import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("VITE_GEMINI_API_KEY is not defined in the environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface ChatMessage {
  role: 'user' | 'model' | 'error';
  text: string;
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
