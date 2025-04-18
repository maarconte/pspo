import "react-toastify/dist/ReactToastify.css";

import { FC, ReactNode, createContext, useMemo, useState } from "react";
import { Question, UserAnswer } from "../types";
import { ToastContainer, toast } from "react-toastify";

import { useFetchFirebase } from "../hooks";

interface QuestionsContextValue {
  questions: Question[];
  allQuestions: Question[];
  score: number;
  setScore: (score: number) => void;
  userAnswers: UserAnswer[];
  setUserAnswers: any;
  refetch: any;
  formation: string;
  setFormation: (formation: string) => void;
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
  formation: "",
  setFormation: () => {},
});
interface QuestionsProviderProps {
  children: ReactNode;
}

export const QuestionsProvider: FC<QuestionsProviderProps> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [formation, setFormation] = useState<string>("pspo-I");
  // Fetch questions from Firebase
  const { data, isLoading, errorMessage, refetch } =
    useFetchFirebase("questions");
  // Set questions in state
  useMemo(() => {
    if (!isLoading && !errorMessage) {
      // select 80 random questions
      const selectedQuestions = [...data];
      // get questions with type equals to formation
      const selectedQuestionsByType = selectedQuestions.filter(
        (question) => question.type === formation
      );

      if (selectedQuestionsByType.length > 0) {
        selectedQuestionsByType.sort(() => Math.random() - 0.5);
        selectedQuestionsByType.length = 80;
      }

      // get isFlagged questions
      const flagged = selectedQuestions.filter(
        (question) => question.isFlagged
      );

      setAllQuestions(data);
      setQuestions(selectedQuestionsByType);
    } else if (errorMessage) {
      const notify = () => toast.error(errorMessage.toString());
      notify();
    }
  }, [data, isLoading, errorMessage, formation]);

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
        formation,
        setFormation,
      }}
    >
      {children}
      <ToastContainer autoClose={false} />
    </QuestionsContext.Provider>
  );
};
