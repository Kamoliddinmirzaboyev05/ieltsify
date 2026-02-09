// Central Data Manager - localStorage operations
import type { VocabularyWord, Article, ListeningResource, UserNote, WritingTask, WritingDraft, ReadingPassage, ListeningTest, WritingSubmission } from '../types';

const STORAGE_KEYS = {
  VOCABULARY: 'ieltsify_vocabulary',
  ARTICLES: 'ieltsify_articles',
  LISTENING: 'ieltsify_listening',
  NOTES: 'ieltsify_notes',
  WRITING_TASKS: 'ieltsify_writing_tasks',
  WRITING_DRAFTS: 'ieltsify_writing_drafts',
  READING_PASSAGES: 'ieltsify_reading_passages',
  LISTENING_TESTS: 'ieltsify_listening_tests',
  WRITING_SUBMISSIONS: 'ieltsify_writing_submissions',
} as const;

// Generic localStorage helpers
const getFromStorage = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return [];
  }
};

const saveToStorage = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};

// Vocabulary Operations
export const vocabularyManager = {
  getAll: (): VocabularyWord[] => getFromStorage<VocabularyWord>(STORAGE_KEYS.VOCABULARY),
  
  add: (word: Omit<VocabularyWord, 'id' | 'addedDate' | 'reviewCount'>): VocabularyWord => {
    const words = vocabularyManager.getAll();
    const newWord: VocabularyWord = {
      ...word,
      id: `vocab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      addedDate: new Date().toISOString(),
      reviewCount: 0,
    };
    words.push(newWord);
    saveToStorage(STORAGE_KEYS.VOCABULARY, words);
    return newWord;
  },
  
  update: (id: string, updates: Partial<VocabularyWord>): void => {
    const words = vocabularyManager.getAll();
    const index = words.findIndex(w => w.id === id);
    if (index !== -1) {
      words[index] = { ...words[index], ...updates };
      saveToStorage(STORAGE_KEYS.VOCABULARY, words);
    }
  },
  
  delete: (id: string): void => {
    const words = vocabularyManager.getAll().filter(w => w.id !== id);
    saveToStorage(STORAGE_KEYS.VOCABULARY, words);
  },
  
  search: (query: string): VocabularyWord[] => {
    const words = vocabularyManager.getAll();
    const lowerQuery = query.toLowerCase();
    return words.filter(w => 
      w.word.toLowerCase().includes(lowerQuery) ||
      w.definition.toLowerCase().includes(lowerQuery)
    );
  },
};

// Article Operations
export const articleManager = {
  getAll: (): Article[] => getFromStorage<Article>(STORAGE_KEYS.ARTICLES),
  
  add: (article: Omit<Article, 'id' | 'uploadDate'>): Article => {
    const articles = articleManager.getAll();
    const newArticle: Article = {
      ...article,
      id: `article_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploadDate: new Date().toISOString(),
    };
    articles.push(newArticle);
    saveToStorage(STORAGE_KEYS.ARTICLES, articles);
    return newArticle;
  },
  
  update: (id: string, updates: Partial<Article>): void => {
    const articles = articleManager.getAll();
    const index = articles.findIndex(a => a.id === id);
    if (index !== -1) {
      articles[index] = { ...articles[index], ...updates };
      saveToStorage(STORAGE_KEYS.ARTICLES, articles);
    }
  },
  
  delete: (id: string): void => {
    const articles = articleManager.getAll().filter(a => a.id !== id);
    saveToStorage(STORAGE_KEYS.ARTICLES, articles);
  },
  
  getById: (id: string): Article | undefined => {
    return articleManager.getAll().find(a => a.id === id);
  },
};

// Listening Operations
export const listeningManager = {
  getAll: (): ListeningResource[] => getFromStorage<ListeningResource>(STORAGE_KEYS.LISTENING),
  
  add: (resource: Omit<ListeningResource, 'id' | 'uploadDate'>): ListeningResource => {
    const resources = listeningManager.getAll();
    const newResource: ListeningResource = {
      ...resource,
      id: `listening_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploadDate: new Date().toISOString(),
    };
    resources.push(newResource);
    saveToStorage(STORAGE_KEYS.LISTENING, resources);
    return newResource;
  },
  
  update: (id: string, updates: Partial<ListeningResource>): void => {
    const resources = listeningManager.getAll();
    const index = resources.findIndex(r => r.id === id);
    if (index !== -1) {
      resources[index] = { ...resources[index], ...updates };
      saveToStorage(STORAGE_KEYS.LISTENING, resources);
    }
  },
  
  delete: (id: string): void => {
    const resources = listeningManager.getAll().filter(r => r.id !== id);
    saveToStorage(STORAGE_KEYS.LISTENING, resources);
  },
};

// Notes Operations
export const notesManager = {
  getAll: (): UserNote[] => getFromStorage<UserNote>(STORAGE_KEYS.NOTES),
  
  add: (note: Omit<UserNote, 'id' | 'timestamp'>): UserNote => {
    const notes = notesManager.getAll();
    const newNote: UserNote = {
      ...note,
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    notes.push(newNote);
    saveToStorage(STORAGE_KEYS.NOTES, notes);
    return newNote;
  },
  
  getByResource: (resourceId: string): UserNote[] => {
    return notesManager.getAll().filter(n => n.resourceId === resourceId);
  },
  
  delete: (id: string): void => {
    const notes = notesManager.getAll().filter(n => n.id !== id);
    saveToStorage(STORAGE_KEYS.NOTES, notes);
  },
};

// Global Search
export const globalSearch = (query: string) => {
  const lowerQuery = query.toLowerCase();
  const results: Array<{
    id: string;
    type: 'vocabulary' | 'article' | 'listening';
    title: string;
    snippet: string;
  }> = [];

  // Search vocabulary
  vocabularyManager.getAll().forEach(word => {
    if (word.word.toLowerCase().includes(lowerQuery) || 
        word.definition.toLowerCase().includes(lowerQuery)) {
      results.push({
        id: word.id,
        type: 'vocabulary',
        title: word.word,
        snippet: word.definition.substring(0, 100),
      });
    }
  });

  // Search articles
  articleManager.getAll().forEach(article => {
    if (article.title.toLowerCase().includes(lowerQuery) ||
        article.htmlContent.toLowerCase().includes(lowerQuery)) {
      results.push({
        id: article.id,
        type: 'article',
        title: article.title,
        snippet: article.htmlContent.replace(/<[^>]*>/g, '').substring(0, 100),
      });
    }
  });

  // Search listening
  listeningManager.getAll().forEach(resource => {
    if (resource.title.toLowerCase().includes(lowerQuery)) {
      results.push({
        id: resource.id,
        type: 'listening',
        title: resource.title,
        snippet: `${resource.category} - ${resource.difficulty}`,
      });
    }
  });

  return results;
};


// Writing Task Operations
export const writingTaskManager = {
  getAll: (): WritingTask[] => getFromStorage<WritingTask>(STORAGE_KEYS.WRITING_TASKS),
  
  add: (task: Omit<WritingTask, 'id' | 'uploadDate'>): WritingTask => {
    const tasks = writingTaskManager.getAll();
    const newTask: WritingTask = {
      ...task,
      id: `writing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploadDate: new Date().toISOString(),
    };
    tasks.push(newTask);
    saveToStorage(STORAGE_KEYS.WRITING_TASKS, tasks);
    return newTask;
  },
  
  update: (id: string, updates: Partial<WritingTask>): void => {
    const tasks = writingTaskManager.getAll();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      saveToStorage(STORAGE_KEYS.WRITING_TASKS, tasks);
    }
  },
  
  delete: (id: string): void => {
    const tasks = writingTaskManager.getAll().filter(t => t.id !== id);
    saveToStorage(STORAGE_KEYS.WRITING_TASKS, tasks);
  },
  
  getById: (id: string): WritingTask | undefined => {
    return writingTaskManager.getAll().find(t => t.id === id);
  },
};

// Writing Draft Operations
export const writingDraftManager = {
  getAll: (): WritingDraft[] => getFromStorage<WritingDraft>(STORAGE_KEYS.WRITING_DRAFTS),
  
  getByTaskId: (taskId: string): WritingDraft | undefined => {
    return writingDraftManager.getAll().find(d => d.taskId === taskId && !d.submitted);
  },
  
  save: (draft: Omit<WritingDraft, 'id' | 'lastSaved'>): WritingDraft => {
    const drafts = writingDraftManager.getAll();
    const existingIndex = drafts.findIndex(d => d.taskId === draft.taskId && !d.submitted);
    
    const savedDraft: WritingDraft = {
      ...draft,
      id: existingIndex !== -1 ? drafts[existingIndex].id : `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      lastSaved: new Date().toISOString(),
    };
    
    if (existingIndex !== -1) {
      drafts[existingIndex] = savedDraft;
    } else {
      drafts.push(savedDraft);
    }
    
    saveToStorage(STORAGE_KEYS.WRITING_DRAFTS, drafts);
    return savedDraft;
  },
  
  submit: (taskId: string): void => {
    const drafts = writingDraftManager.getAll();
    const index = drafts.findIndex(d => d.taskId === taskId && !d.submitted);
    if (index !== -1) {
      drafts[index].submitted = true;
      saveToStorage(STORAGE_KEYS.WRITING_DRAFTS, drafts);
    }
  },
  
  delete: (id: string): void => {
    const drafts = writingDraftManager.getAll().filter(d => d.id !== id);
    saveToStorage(STORAGE_KEYS.WRITING_DRAFTS, drafts);
  },
};


// Reading Passage Operations (for Reading Mock Tests)
export const readingPassageManager = {
  getAll: (): ReadingPassage[] => getFromStorage<ReadingPassage>(STORAGE_KEYS.READING_PASSAGES),
  
  add: (passage: Omit<ReadingPassage, 'id' | 'uploadDate'>): ReadingPassage => {
    const passages = readingPassageManager.getAll();
    const newPassage: ReadingPassage = {
      ...passage,
      id: `reading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploadDate: new Date().toISOString(),
    };
    passages.push(newPassage);
    saveToStorage(STORAGE_KEYS.READING_PASSAGES, passages);
    return newPassage;
  },
  
  update: (id: string, updates: Partial<ReadingPassage>): void => {
    const passages = readingPassageManager.getAll();
    const index = passages.findIndex(p => p.id === id);
    if (index !== -1) {
      passages[index] = { ...passages[index], ...updates };
      saveToStorage(STORAGE_KEYS.READING_PASSAGES, passages);
    }
  },
  
  delete: (id: string): void => {
    const passages = readingPassageManager.getAll().filter(p => p.id !== id);
    saveToStorage(STORAGE_KEYS.READING_PASSAGES, passages);
  },
  
  getById: (id: string): ReadingPassage | undefined => {
    return readingPassageManager.getAll().find(p => p.id === id);
  },
};

// Listening Test Operations (for Listening Mock Tests)
export const listeningTestManager = {
  getAll: (): ListeningTest[] => getFromStorage<ListeningTest>(STORAGE_KEYS.LISTENING_TESTS),
  
  add: (test: Omit<ListeningTest, 'id' | 'uploadDate'>): ListeningTest => {
    const tests = listeningTestManager.getAll();
    const newTest: ListeningTest = {
      ...test,
      id: `listening_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploadDate: new Date().toISOString(),
    };
    tests.push(newTest);
    saveToStorage(STORAGE_KEYS.LISTENING_TESTS, tests);
    return newTest;
  },
  
  update: (id: string, updates: Partial<ListeningTest>): void => {
    const tests = listeningTestManager.getAll();
    const index = tests.findIndex(t => t.id === id);
    if (index !== -1) {
      tests[index] = { ...tests[index], ...updates };
      saveToStorage(STORAGE_KEYS.LISTENING_TESTS, tests);
    }
  },
  
  delete: (id: string): void => {
    const tests = listeningTestManager.getAll().filter(t => t.id !== id);
    saveToStorage(STORAGE_KEYS.LISTENING_TESTS, tests);
  },
  
  getById: (id: string): ListeningTest | undefined => {
    return listeningTestManager.getAll().find(t => t.id === id);
  },
};


// Writing Submission Operations
export const writingSubmissionManager = {
  getAll: (): WritingSubmission[] => getFromStorage<WritingSubmission>(STORAGE_KEYS.WRITING_SUBMISSIONS),
  
  add: (submission: Omit<WritingSubmission, 'id' | 'submittedAt'>): WritingSubmission => {
    const submissions = writingSubmissionManager.getAll();
    const newSubmission: WritingSubmission = {
      ...submission,
      id: `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      submittedAt: new Date().toISOString(),
    };
    submissions.push(newSubmission);
    saveToStorage(STORAGE_KEYS.WRITING_SUBMISSIONS, submissions);
    return newSubmission;
  },
  
  update: (id: string, updates: Partial<WritingSubmission>): void => {
    const submissions = writingSubmissionManager.getAll();
    const index = submissions.findIndex(s => s.id === id);
    if (index !== -1) {
      submissions[index] = { ...submissions[index], ...updates };
      saveToStorage(STORAGE_KEYS.WRITING_SUBMISSIONS, submissions);
    }
  },
  
  getById: (id: string): WritingSubmission | undefined => {
    return writingSubmissionManager.getAll().find(s => s.id === id);
  },
  
  getByTaskId: (taskId: string): WritingSubmission[] => {
    return writingSubmissionManager.getAll().filter(s => s.taskId === taskId);
  },
};
