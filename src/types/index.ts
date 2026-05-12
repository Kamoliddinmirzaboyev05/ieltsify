// Core Data Types for IELTSify

export interface VocabularyWord {
  id: string;
  word: string;
  definition: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  audioUrl?: string;
  masteryLevel: number; // 0-100
  examples?: string[];
  synonyms?: string[];
  addedDate: string;
  lastReviewed?: string;
  reviewCount: number;
}

export interface Article {
  id: string;
  title: string;
  htmlContent: string;
  category: 'reading' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
  uploadDate: string;
  tags?: string[];
}

export interface ListeningResource {
  id: string;
  title: string;
  youtubeUrl: string;
  category: 'academic' | 'general' | 'podcast' | 'lecture';
  difficulty: 'easy' | 'medium' | 'hard';
  duration?: string;
  uploadDate: string;
  notes?: string;
}

export interface UserNote {
  id: string;
  resourceId: string;
  resourceType: 'article' | 'listening' | 'vocabulary';
  content: string;
  timestamp: string;
}

export interface WritingTask {
  id: string;
  title: string;
  task1Question: string;
  task1ImageUrl?: string;
  task2Question: string;
  uploadDate: string;
}

export interface WritingSubmission {
  id: string;
  taskId: string;
  task1Content: string;
  task1WordCount: number;
  task2Content: string;
  task2WordCount: number;
  totalTimeSpent: number; // seconds
  submittedAt: string;
  aiFeedback?: {
    task1Score: number;
    task1Feedback: string;
    task2Score: number;
    task2Feedback: string;
    overallScore: number;
    overallFeedback: string;
  };
}

export interface WritingDraft {
  id: string;
  taskId: string;
  content: string;
  wordCount: number;
  timeSpent: number; // seconds
  lastSaved: string;
  submitted: boolean;
}

export interface SearchResult {
  id: string;
  type: 'vocabulary' | 'article' | 'listening';
  title: string;
  snippet: string;
  relevance: number;
}

export interface ReadingPassage {
  id: string;
  title: string;
  slug: string;
  html_content_url: string;
  cover_image_url: string;
  difficulty: 'easy' | 'medium' | 'hard';
  word_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListeningTest {
  id: string;
  title: string;
  slug: string;
  description: string;
  html_file_url: string;
  cover_image_url: string;
  difficulty: 'easy' | 'medium' | 'hard';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
