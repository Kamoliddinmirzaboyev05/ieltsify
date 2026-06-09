// Central Data Manager - Supabase operations
import { supabase } from "../lib/supabase";
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

// Vocabulary Operations
export const vocabularyManager = {
  getAll: async (): Promise<VocabularyWord[]> => {
    const { data, error } = await supabase.from("vocabulary").select("*");
    if (error) {
      console.error("Error reading vocabulary:", error);
      return [];
    }
    return data || [];
  },

  add: async (
    word: Omit<VocabularyWord, "id" | "addedDate" | "reviewCount">,
  ): Promise<VocabularyWord> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const newWord = {
      ...word,
      user_id: user?.id,
      addedDate: new Date().toISOString(),
      reviewCount: 0,
    };
    const { data, error } = await supabase
      .from("vocabulary")
      .insert(newWord)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (
    id: string,
    updates: Partial<VocabularyWord>,
  ): Promise<void> => {
    const { error } = await supabase
      .from("vocabulary")
      .update(updates)
      .eq("id", id);
    if (error) throw error;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from("vocabulary").delete().eq("id", id);
    if (error) throw error;
  },

  search: async (query: string): Promise<VocabularyWord[]> => {
    const { data, error } = await supabase
      .from("vocabulary")
      .select("*")
      .or(`word.ilike.%${query}%,definition.ilike.%${query}%`);
    if (error) {
      console.error("Error searching vocabulary:", error);
      return [];
    }
    return data || [];
  },
};

// Article Operations
export const articleManager = {
  getAll: async (): Promise<Article[]> => {
    const { data, error } = await supabase.from("articles").select("*");
    if (error) {
      console.error("Error reading articles:", error);
      return [];
    }
    return data || [];
  },

  add: async (
    article: Omit<Article, "id" | "uploadDate">,
  ): Promise<Article> => {
    const newArticle = {
      ...article,
      uploadDate: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from("articles")
      .insert(newArticle)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<Article>): Promise<void> => {
    const { error } = await supabase
      .from("articles")
      .update(updates)
      .eq("id", id);
    if (error) throw error;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) throw error;
  },

  getById: async (id: string): Promise<Article | undefined> => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return undefined;
    return data;
  },
};

// Listening Operations
export const listeningManager = {
  getAll: async (): Promise<ListeningResource[]> => {
    const { data, error } = await supabase.from("listening").select("*");
    if (error) {
      console.error("Error reading listening:", error);
      return [];
    }
    return data || [];
  },

  add: async (
    resource: Omit<ListeningResource, "id" | "uploadDate">,
  ): Promise<ListeningResource> => {
    const newResource = {
      ...resource,
      uploadDate: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from("listening")
      .insert(newResource)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (
    id: string,
    updates: Partial<ListeningResource>,
  ): Promise<void> => {
    const { error } = await supabase
      .from("listening")
      .update(updates)
      .eq("id", id);
    if (error) throw error;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from("listening").delete().eq("id", id);
    if (error) throw error;
  },
};

// Notes Operations
export const notesManager = {
  getAll: async (): Promise<UserNote[]> => {
    const { data, error } = await supabase.from("notes").select("*");
    if (error) {
      console.error("Error reading notes:", error);
      return [];
    }
    return data || [];
  },

  add: async (note: Omit<UserNote, "id" | "timestamp">): Promise<UserNote> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const newNote = {
      ...note,
      user_id: user?.id,
      timestamp: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from("notes")
      .insert(newNote)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  getByResource: async (resourceId: string): Promise<UserNote[]> => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("resourceId", resourceId);
    if (error) return [];
    return data || [];
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) throw error;
  },
};

// Writing Task Operations
export const writingTaskManager = {
  getAll: async (): Promise<WritingTask[]> => {
    const { data, error } = await supabase.from("writing_tasks").select("*");
    if (error) {
      console.error("Error reading writing tasks:", error);
      return [];
    }
    return data || [];
  },

  add: async (
    task: Omit<WritingTask, "id" | "uploadDate">,
  ): Promise<WritingTask> => {
    const newTask = {
      title: task.title,
      task1_question: task.task1Question,
      task1_image_url: task.task1ImageUrl,
      task2_question: task.task2Question,
      upload_date: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from("writing_tasks")
      .insert(newTask)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<WritingTask>): Promise<void> => {
    const { error } = await supabase
      .from("writing_tasks")
      .update(updates)
      .eq("id", id);
    if (error) throw error;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("writing_tasks")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },

  getById: async (id: string): Promise<WritingTask | undefined> => {
    const { data, error } = await supabase
      .from("writing_tasks")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return undefined;
    return data;
  },
};

// Writing Draft Operations
export const writingDraftManager = {
  getAll: async (): Promise<WritingDraft[]> => {
    const { data, error } = await supabase.from("writing_drafts").select("*");
    if (error) {
      console.error("Error reading writing drafts:", error);
      return [];
    }
    return data || [];
  },

  getByTaskId: async (taskId: string): Promise<WritingDraft | undefined> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("writing_drafts")
      .select("*")
      .eq("task_id", taskId)
      .eq("user_id", user?.id)
      .eq("submitted", false)
      .maybeSingle();

    if (error) return undefined;
    return data || undefined;
  },

  save: async (
    draft: Omit<WritingDraft, "id" | "lastSaved">,
  ): Promise<WritingDraft> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const savedDraft = {
      task_id: draft.taskId,
      content: draft.content,
      word_count: draft.wordCount,
      time_spent: draft.timeSpent,
      user_id: user?.id,
      last_saved: new Date().toISOString(),
      submitted: draft.submitted,
    };

    const { data, error } = await supabase
      .from("writing_drafts")
      .upsert(savedDraft)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  submit: async (taskId: string): Promise<void> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("writing_drafts")
      .update({ submitted: true })
      .eq("task_id", taskId)
      .eq("user_id", user?.id)
      .eq("submitted", false);

    if (error) throw error;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("writing_drafts")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};

// Reading Passage Operations
export const readingPassageManager = {
  getAll: async (): Promise<ReadingPassage[]> => {
    const { data, error } = await supabase.from("reading_passages").select("*");
    if (error) return [];
    return data || [];
  },

  getById: async (id: string): Promise<ReadingPassage | undefined> => {
    const { data, error } = await supabase
      .from("reading_passages")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return undefined;
    return data;
  },
};

// Listening Test Operations
export const listeningTestManager = {
  getAll: async (): Promise<ListeningTest[]> => {
    const { data, error } = await supabase.from("listening_tests").select("*");
    if (error) return [];
    return data || [];
  },

  getById: async (id: string): Promise<ListeningTest | undefined> => {
    const { data, error } = await supabase
      .from("listening_tests")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return undefined;
    return data;
  },
};

// Writing Submission Operations
export const writingSubmissionManager = {
  getAll: async (): Promise<WritingSubmission[]> => {
    const { data, error } = await supabase
      .from("writing_submissions")
      .select("*");
    if (error) return [];
    return data || [];
  },

  add: async (
    submission: Omit<WritingSubmission, "id" | "submittedAt">,
  ): Promise<WritingSubmission> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const newSubmission = {
      task_id: submission.taskId,
      task1_content: submission.task1Content,
      task1_word_count: submission.task1WordCount,
      task2_content: submission.task2Content,
      task2_word_count: submission.task2WordCount,
      total_time_spent: submission.totalTimeSpent,
      user_id: user?.id,
      submitted_at: new Date().toISOString(),
      ai_feedback: submission.aiFeedback,
    };
    const { data, error } = await supabase
      .from("writing_submissions")
      .insert(newSubmission)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  getByTaskId: async (taskId: string): Promise<WritingSubmission[]> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("writing_submissions")
      .select("*")
      .eq("task_id", taskId)
      .eq("user_id", user?.id);
    if (error) return [];
    return data || [];
  },
};

// Speaking Test Operations
export const speakingTestManager = {
  getAll: async (): Promise<any[]> => {
    const { data, error } = await supabase.from("speaking_tests").select("*");
    if (error) {
      console.error("Error reading speaking tests:", error);
      return [];
    }
    return data || [];
  },

  getById: async (id: string): Promise<any | undefined> => {
    const { data, error } = await supabase
      .from("speaking_tests")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return undefined;
    return data;
  },
};

// Global Search
export const globalSearch = async (query: string) => {
  const results: Array<{
    id: string;
    type: "vocabulary" | "article" | "listening";
    title: string;
    snippet: string;
  }> = [];

  // Search vocabulary
  const vocabResults = await vocabularyManager.search(query);
  vocabResults.forEach((word) => {
    results.push({
      id: word.id,
      type: "vocabulary",
      title: word.word,
      snippet: word.definition.substring(0, 100),
    });
  });

  // Search articles
  const { data: articles, error: articleError } = await supabase
    .from("articles")
    .select("*")
    .or(`title.ilike.%${query}%,htmlContent.ilike.%${query}%`);

  if (!articleError && articles) {
    articles.forEach((article: any) => {
      results.push({
        id: article.id,
        type: "article",
        title: article.title,
        snippet: article.htmlContent.replace(/<[^>]*>/g, "").substring(0, 100),
      });
    });
  }

  // Search listening
  const { data: listening, error: listeningError } = await supabase
    .from("listening")
    .select("*")
    .ilike("title", `%${query}%`);

  if (!listeningError && listening) {
    listening.forEach((resource: any) => {
      results.push({
        id: resource.id,
        type: "listening",
        title: resource.title,
        snippet: `${resource.category} - ${resource.difficulty}`,
      });
    });
  }

  return results;
};
