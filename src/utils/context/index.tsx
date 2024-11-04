import { FC, ReactNode, createContext, useEffect, useState } from "react";
import { Question, UserAnswer } from "../types";

import { useFetchFirebase } from "../hooks";

// Create a context for the questions fetched from Firebase
interface QuestionsContextValue {
  questions: Question[];
  score: number;
  setScore: (score: number) => void;
  userAnswers: UserAnswer[];
  setUserAnswers: any;
}

export const QuestionsContext = createContext<QuestionsContextValue>({
  questions: [],
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
  const [score, setScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  // Fetch questions from Firebase
  const { data, isLoading, errorMessage } = useFetchFirebase("questions");
  // Set questions in state
  useEffect(() => {
    if (!isLoading && !errorMessage) {
      // select 80 random questions
      data.sort(() => Math.random() - 0.5);
      data.length = 80;
      setQuestions(data);
    }
  }, [data, isLoading, errorMessage]);

  return (
    <QuestionsContext.Provider
      value={{ questions, score, setScore, userAnswers, setUserAnswers }}
    >
      {children}
    </QuestionsContext.Provider>
  );
};
