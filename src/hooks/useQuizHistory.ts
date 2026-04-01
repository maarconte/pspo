import { useQuery } from '@tanstack/react-query';
import { getQuizSessions } from '../lib/firebase/stats';
import { QuizSessionStat } from '../utils/types';
import { useUserStore } from '../stores/useUserStore';

export const useQuizHistory = () => {
  const user = useUserStore((state) => state.user);
  
  return useQuery<QuizSessionStat[], Error>({
    queryKey: ['quizHistory', user?.uid],
    queryFn: () => getQuizSessions(user?.uid || ''),
    enabled: !!user?.uid, // Only run query if user is logged in
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
