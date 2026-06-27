// AI service — endi Gemini'ni TO'G'RIDAN-TO'G'RI emas, balki backend gateway
// orqali chaqiradi. API kalit faqat serverda; brauzer bundle'ida kalit yo'q.
import { authenticatedFetch } from "./authService";

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

export interface WritingFullTestEvaluation {
  task1Score: number;
  task1Feedback: string;
  task2Score: number;
  task2Feedback: string;
  overallScore: number;
  overallFeedback: string;
}

// Backendga POST yuborib JSON javob oluvchi yordamchi
const postAI = async <T>(path: string, body: unknown): Promise<T> => {
  const res = await authenticatedFetch(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.detail || "AI xizmatida xatolik");
  }
  return res.json();
};

export const sendMessageToGemini = async (prompt: string): Promise<string> => {
  try {
    const data = await postAI<{ text: string }>('/chat/', { prompt });
    return data.text;
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return `Sorry, I encountered an error: ${error.message || "Unknown error"}`;
  }
};

export const evaluateWriting = async (topic: string, essay: string): Promise<WritingEvaluation> => {
  return postAI<WritingEvaluation>('/evaluate-writing/', { topic, essay });
};

export const evaluateSpeaking = async (question: string, transcript: string): Promise<SpeakingEvaluation> => {
  return postAI<SpeakingEvaluation>('/evaluate-speaking/', { question, transcript });
};

export const evaluateFullWritingTest = async (
  task1Question: string,
  task1Essay: string,
  task2Question: string,
  task2Essay: string
): Promise<WritingFullTestEvaluation> => {
  return postAI<WritingFullTestEvaluation>('/evaluate-full-writing/', {
    task1Question,
    task1Essay,
    task2Question,
    task2Essay,
  });
};
