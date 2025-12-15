import { FC, ReactNode, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useFetchFirebase } from "../../utils/hooks";
import { useQuestionsStore } from "../../stores/useQuestionsStore";

interface QuestionsLoaderProps {
  children: ReactNode;
}

/**
 * Component that loads questions from Firebase and updates the Zustand store
 * Replaces the old QuestionsProvider context
 */
export const QuestionsLoader: FC<QuestionsLoaderProps> = ({ children }) => {
  const formation = useQuestionsStore((state) => state.formation);

  const { data, isLoading, errorMessage, refetch } = useFetchFirebase("questions");

  // Update loading state
  useEffect(() => {
    useQuestionsStore.setState({ isLoading });
  }, [isLoading]);

  // Load questions when data changes
  useEffect(() => {
    if (!isLoading && data && data.length > 0) {
      useQuestionsStore.getState().loadQuestions(data);
    } else if (!isLoading && (!data || data.length === 0)) {
      // No data received from Firebase
    }
  }, [data, isLoading]);

  // Handle errors
  useEffect(() => {
    if (errorMessage) {
      useQuestionsStore.setState({ error: errorMessage.toString() });
      toast.error(errorMessage.toString());
    }
  }, [errorMessage]);

  // Store refetch function
  useEffect(() => {
    useQuestionsStore.setState({ refetch });
  }, [refetch]);

  return (
    <>
      {children}
      <ToastContainer autoClose={false} />
    </>
  );
};
