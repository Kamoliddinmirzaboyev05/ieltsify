import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  vocabularyManager, 
  articleManager, 
  listeningTestManager, 
  readingPassageManager,
  writingTaskManager,
  writingSubmissionManager,
  speakingTestManager
} from '../services/dataManager';

// ==================== VOCABULARY ====================

export const useVocabulary = () => {
  return useQuery({
    queryKey: ['vocabulary'],
    queryFn: vocabularyManager.getAll,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// ==================== ARTICLES ====================

export const useArticles = () => {
  return useQuery({
    queryKey: ['articles'],
    queryFn: articleManager.getAll,
  });
};

export const useArticle = (id: string) => {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => articleManager.getById(id),
    enabled: !!id,
  });
};

// ==================== LISTENING ====================

export const useListeningTests = () => {
  return useQuery({
    queryKey: ['listening_tests'],
    queryFn: listeningTestManager.getAll,
  });
};

export const useListeningTest = (id: string) => {
  return useQuery({
    queryKey: ['listening_test', id],
    queryFn: () => listeningTestManager.getById(id),
    enabled: !!id,
  });
};

// ==================== READING ====================

export const useReadingPassages = () => {
  return useQuery({
    queryKey: ['reading_passages'],
    queryFn: readingPassageManager.getAll,
  });
};

export const useReadingPassage = (id: string) => {
  return useQuery({
    queryKey: ['reading_passage', id],
    queryFn: () => readingPassageManager.getById(id),
    enabled: !!id,
  });
};

// ==================== WRITING ====================

export const useWritingTasks = () => {
  return useQuery({
    queryKey: ['writing_tasks'],
    queryFn: writingTaskManager.getAll,
  });
};

export const useWritingSubmissions = () => {
  return useQuery({
    queryKey: ['writing_submissions'],
    queryFn: writingSubmissionManager.getAll,
  });
};

// ==================== SPEAKING ====================

export const useSpeakingTests = () => {
  return useQuery({
    queryKey: ['speaking_tests'],
    queryFn: speakingTestManager.getAll,
  });
};

// ==================== MUTATIONS ====================

export const useAddVocabulary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: vocabularyManager.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary'] });
    },
  });
};
