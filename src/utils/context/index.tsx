import "react-toastify/dist/ReactToastify.css";

import { FC, ReactNode, createContext, useMemo, useState } from "react";
import { Question, UserAnswer } from "../types";
import { ToastContainer, toast } from "react-toastify";

import { useFetchFirebase } from "../hooks";

// Create a context for the questions fetched from Firebase
interface QuestionsContextValue {
  questions: Question[];
  allQuestions: Question[];
  score: number;
  setScore: (score: number) => void;
  userAnswers: UserAnswer[];
  setUserAnswers: any;
  refetch: any;
  testRefetch: any;
}

export const QuestionsContext = createContext<QuestionsContextValue>({
  questions: [],
  allQuestions: [],
  score: 0,
  setScore: () => {},
  userAnswers: [],
  setUserAnswers: () => {
    return [];
  },
  refetch: () => {},
  testRefetch: () => {},
});

// Create a context provider for the questions
interface QuestionsProviderProps {
  children: ReactNode;
}

export const QuestionsProvider: FC<QuestionsProviderProps> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  // Fetch questions from Firebase
  const { data, isLoading, errorMessage, refetch } =
    useFetchFirebase("questions");
  // Set questions in state
  useMemo(() => {
    if (!isLoading && !errorMessage) {
      // select 80 random questions
      const selectedQuestions = [...data];
      selectedQuestions.sort(() => Math.random() - 0.5);
      // get isFlagged questions
      const flagged = selectedQuestions.filter(
        (question) => question.isFlagged
      );
      selectedQuestions.length = 80;
      setQuestions(selectedQuestions);
    } else if (errorMessage) {
      const notify = () => toast.error(errorMessage.toString());
      notify();
    }
  }, [data, isLoading, errorMessage]);

  useMemo(() => {
    if (!isLoading && !errorMessage) {
      console.log("questions");
      setAllQuestions(data);
    } else if (errorMessage) {
      const notify = () => toast.error(errorMessage.toString());
      notify();
    }
  }, [data, isLoading, errorMessage]);

  const testRefetch = () => {
    console.log("fetch");
    refetch();
  };

  return (
    <QuestionsContext.Provider
      value={{
        questions,
        score,
        setScore,
        userAnswers,
        setUserAnswers,
        allQuestions,
        refetch,
        testRefetch,
      }}
    >
      {children}
      <ToastContainer autoClose={false} />
    </QuestionsContext.Provider>
  );
};
