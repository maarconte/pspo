import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveQuizSession } from '../lib/firebase/stats';
import { incrementModuleCompletedCount } from '../features/admin/api/modules.api';
import { QuizSessionStat } from '../utils/types';

export const useSaveQuizSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (session: Omit<QuizSessionStat, 'id'>) => saveQuizSession(session),
    onSuccess: (_, variables) => {
      // Invalidate the query to fetch fresh history on next render
      queryClient.invalidateQueries({
        queryKey: ['quizHistory', variables.userId],
      });
      incrementModuleCompletedCount(variables.formation).catch((err) => {
        console.warn('Failed to increment module completed count:', err);
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la sauvegarde de la session:', error);
    }
  });
};
