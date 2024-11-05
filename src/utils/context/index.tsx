import "react-toastify/dist/ReactToastify.css";

import { FC, ReactNode, createContext, useEffect, useState } from "react";
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
  const { data, isLoading, errorMessage } = useFetchFirebase("questions");
  // Set questions in state
  useEffect(() => {
    if (!isLoading && !errorMessage) {
      // select 80 random questions
      const selectedQuestions = [...data];
      selectedQuestions.sort(() => Math.random() - 0.5);
      selectedQuestions.length = 80;
      setQuestions(selectedQuestions);
      setAllQuestions(data);
    } else if (errorMessage) {
      const notify = () => toast.error(errorMessage.toString());
      notify();
    }
  }, [data, isLoading, errorMessage]);

  return (
    <QuestionsContext.Provider
      value={{
        questions,
        score,
        setScore,
        userAnswers,
        setUserAnswers,
        allQuestions,
      }}
    >
      {children}
      <ToastContainer autoClose={false} />
    </QuestionsContext.Provider>
  );
};
