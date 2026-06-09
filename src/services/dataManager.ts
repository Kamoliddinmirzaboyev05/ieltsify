// Central Data Manager - uses backend API (VITE_API_BASE_URL) via authenticatedFetch
import { authenticatedFetch } from "./authService";
import type {
  VocabularyWord,
  Article,
  ListeningResource,
  UserNote,
  WritingTask,
  WritingDraft,
  ReadingPassage,
  ListeningTest,
  WritingSubmission,
} from "../types";

const api = async <T>(url: string, opts?: RequestInit): Promise<T> => {
  const r = await authenticatedFetch(url, opts);
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.detail || err.message || "API xatolik");
  }
  return r.json();
};

export const vocabularyManager = {
  getAll: async (): Promise<VocabularyWord[]> => {
    try { return await api<VocabularyWord[]>('/vocabulary/'); } catch { return []; }
  },
  add: async (word: Omit<VocabularyWord, "id" | "addedDate" | "reviewCount">): Promise<VocabularyWord> => {
    return api<VocabularyWord>('/vocabulary/', { method: 'POST', body: JSON.stringify(word) });
  },
  update: async (id: string, updates: Partial<VocabularyWord>): Promise<void> => {
    await api(`/vocabulary/${id}/`, { method: 'PATCH', body: JSON.stringify(updates) });
  },
  delete: async (id: string): Promise<void> => {
    await api(`/vocabulary/${id}/`, { method: 'DELETE' });
  },
  search: async (query: string): Promise<VocabularyWord[]> => {
    try { return await api<VocabularyWord[]>(`/vocabulary/?search=${encodeURIComponent(query)}`); } catch { return []; }
  },
};

export const articleManager = {
  getAll: async (): Promise<Article[]> => { try { return await api<Article[]>('/articles/'); } catch { return []; } },
  add: async (article: Omit<Article, "id" | "uploadDate">): Promise<Article> => {
    return api<Article>('/articles/', { method: 'POST', body: JSON.stringify(article) });
  },
  update: async (id: string, updates: Partial<Article>): Promise<void> => {
    await api(`/articles/${id}/`, { method: 'PATCH', body: JSON.stringify(updates) });
  },
  delete: async (id: string): Promise<void> => { await api(`/articles/${id}/`, { method: 'DELETE' }); },
  getById: async (id: string): Promise<Article | undefined> => {
    try { return await api<Article>(`/articles/${id}/`); } catch { return undefined; }
  },
};

export const listeningManager = {
  getAll: async (): Promise<ListeningResource[]> => { try { return await api<ListeningResource[]>('/listening/'); } catch { return []; } },
  add: async (r: Omit<ListeningResource, "id" | "uploadDate">): Promise<ListeningResource> => {
    return api<ListeningResource>('/listening/', { method: 'POST', body: JSON.stringify(r) });
  },
  update: async (id: string, updates: Partial<ListeningResource>): Promise<void> => {
    await api(`/listening/${id}/`, { method: 'PATCH', body: JSON.stringify(updates) });
  },
  delete: async (id: string): Promise<void> => { await api(`/listening/${id}/`, { method: 'DELETE' }); },
};

export const notesManager = {
  getAll: async (): Promise<UserNote[]> => { try { return await api<UserNote[]>('/notes/'); } catch { return []; } },
  add: async (note: Omit<UserNote, "id" | "timestamp">): Promise<UserNote> => {
    return api<UserNote>('/notes/', { method: 'POST', body: JSON.stringify(note) });
  },
  getByResource: async (resourceId: string): Promise<UserNote[]> => {
    try { return await api<UserNote[]>(`/notes/?resourceId=${resourceId}`); } catch { return []; }
  },
  delete: async (id: string): Promise<void> => { await api(`/notes/${id}/`, { method: 'DELETE' }); },
};

export const writingTaskManager = {
  getAll: async (): Promise<WritingTask[]> => { try { return await api<WritingTask[]>('/writing-tasks/'); } catch { return []; } },
  add: async (task: Omit<WritingTask, "id" | "uploadDate">): Promise<WritingTask> => {
    return api<WritingTask>('/writing-tasks/', { method: 'POST', body: JSON.stringify(task) });
  },
  update: async (id: string, updates: Partial<WritingTask>): Promise<void> => {
    await api(`/writing-tasks/${id}/`, { method: 'PATCH', body: JSON.stringify(updates) });
  },
  delete: async (id: string): Promise<void> => { await api(`/writing-tasks/${id}/`, { method: 'DELETE' }); },
  getById: async (id: string): Promise<WritingTask | undefined> => {
    try { return await api<WritingTask>(`/writing-tasks/${id}/`); } catch { return undefined; }
  },
};

export const writingDraftManager = {
  getAll: async (): Promise<WritingDraft[]> => { try { return await api<WritingDraft[]>('/writing-drafts/'); } catch { return []; } },
  getByTaskId: async (taskId: string): Promise<WritingDraft | undefined> => {
    try { const d = await api<WritingDraft[]>(`/writing-drafts/?task_id=${taskId}&submitted=false`); return d[0]; } catch { return undefined; }
  },
  save: async (draft: Omit<WritingDraft, "id" | "lastSaved">): Promise<WritingDraft> => {
    return api<WritingDraft>('/writing-drafts/', { method: 'POST', body: JSON.stringify(draft) });
  },
  submit: async (taskId: string): Promise<void> => {
    await api('/writing-drafts/submit/', { method: 'POST', body: JSON.stringify({ task_id: taskId }) });
  },
  delete: async (id: string): Promise<void> => { await api(`/writing-drafts/${id}/`, { method: 'DELETE' }); },
};

export const readingPassageManager = {
  getAll: async (): Promise<ReadingPassage[]> => { try { return await api<ReadingPassage[]>('/reading-passages/'); } catch { return []; } },
  getById: async (id: string): Promise<ReadingPassage | undefined> => {
    try { return await api<ReadingPassage>(`/reading-passages/${id}/`); } catch { return undefined; }
  },
};

export const listeningTestManager = {
  getAll: async (): Promise<ListeningTest[]> => { try { return await api<ListeningTest[]>('/listening-tests/'); } catch { return []; } },
  getById: async (id: string): Promise<ListeningTest | undefined> => {
    try { return await api<ListeningTest>(`/listening-tests/${id}/`); } catch { return undefined; }
  },
};

export const writingSubmissionManager = {
  getAll: async (): Promise<WritingSubmission[]> => { try { return await api<WritingSubmission[]>('/writing-submissions/'); } catch { return []; } },
  add: async (s: Omit<WritingSubmission, "id" | "submittedAt">): Promise<WritingSubmission> => {
    return api<WritingSubmission>('/writing-submissions/', { method: 'POST', body: JSON.stringify(s) });
  },
  getByTaskId: async (taskId: string): Promise<WritingSubmission[]> => {
    try { return await api<WritingSubmission[]>(`/writing-submissions/?task_id=${taskId}`); } catch { return []; }
  },
};

export const speakingTestManager = {
  getAll: async (): Promise<any[]> => { try { return await api<any[]>('/speaking-tests/'); } catch { return []; } },
  getById: async (id: string): Promise<any | undefined> => {
    try { return await api<any>(`/speaking-tests/${id}/`); } catch { return undefined; }
  },
};

export const globalSearch = async (query: string) => {
  const results: Array<{ id: string; type: "vocabulary" | "article" | "listening"; title: string; snippet: string }> = [];
  try {
    const [vocab, articles, listening] = await Promise.all([
      vocabularyManager.search(query),
      api<Article[]>(`/articles/?search=${encodeURIComponent(query)}`).catch(() => [] as Article[]),
      api<ListeningResource[]>(`/listening/?search=${encodeURIComponent(query)}`).catch(() => [] as ListeningResource[]),
    ]);
    vocab.forEach((w) => results.push({ id: w.id, type: "vocabulary", title: w.word, snippet: w.definition.substring(0, 100) }));
    articles.forEach((a) => results.push({ id: a.id, type: "article", title: a.title, snippet: a.htmlContent.replace(/<[^>]*>/g, "").substring(0, 100) }));
    listening.forEach((l) => results.push({ id: l.id, type: "listening", title: l.title, snippet: `${l.category} - ${l.difficulty}` }));
  } catch { /* silent */ }
  return results;
};
