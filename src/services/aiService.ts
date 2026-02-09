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


export interface WritingFullTestEvaluation {
  task1Score: number;
  task1Feedback: string;
  task2Score: number;
  task2Feedback: string;
  overallScore: number;
  overallFeedback: string;
}

export const evaluateFullWritingTest = async (
  task1Question: string,
  task1Essay: string,
  task2Question: string,
  task2Essay: string
): Promise<WritingFullTestEvaluation> => {
  const prompt = `Act as a professional IELTS Writing Examiner. Evaluate both Task 1 and Task 2 essays.

**TASK 1:**
Question: "${task1Question}"
Essay: "${task1Essay}"

**TASK 2:**
Question: "${task2Question}"
Essay: "${task2Essay}"

Evaluate each task based on IELTS criteria:
- Task 1: Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy
- Task 2: Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy

Return a JSON object STRICTLY with this structure:
{
  "task1Score": 7.0,
  "task1Feedback": "Detailed professional feedback for Task 1 (minimum 150 words). Include specific strengths, weaknesses, and suggestions for improvement.",
  "task2Score": 7.5,
  "task2Feedback": "Detailed professional feedback for Task 2 (minimum 200 words). Include specific strengths, weaknesses, and suggestions for improvement.",
  "overallScore": 7.0,
  "overallFeedback": "Overall assessment combining both tasks (minimum 100 words). Highlight key areas for improvement."
}

IMPORTANT:
- Scores must be realistic IELTS band scores (0.5 increments: 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0)
- Overall score is the average of Task 1 and Task 2
- Feedback must be professional, constructive, and specific
- Do not include any text before or after the JSON`;

  try {
    const responseText = await sendMessageToGemini(prompt);
    
    // Check if response is an error message
    if (responseText.startsWith('Sorry')) {
      throw new Error('API key invalid yoki muammo bor. Iltimos .env faylida API key ni tekshiring va serverni qayta ishga tushiring.');
    }
    
    const cleanJson = responseText.replace(/```json|```/gi, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Full Writing Test Evaluation Error:", error);
    throw error;
  }
};
