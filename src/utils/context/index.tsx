<<<<<<< HEAD
import "react-toastify/dist/ReactToastify.css";

import {
  FC,
  ReactNode,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Question, UserAnswer } from "../types";
import { ToastContainer, toast } from "react-toastify";
=======
import { FC, ReactNode, createContext, useEffect, useState } from "react";
import { Question, UserAnswer } from "../types";
>>>>>>> 1629881 (utils)

import { useFetchFirebase } from "../hooks";

// Create a context for the questions fetched from Firebase
interface QuestionsContextValue {
  questions: Question[];
<<<<<<< HEAD
  allQuestions: Question[];
=======
>>>>>>> 1629881 (utils)
  score: number;
  setScore: (score: number) => void;
  userAnswers: UserAnswer[];
  setUserAnswers: any;
}

export const QuestionsContext = createContext<QuestionsContextValue>({
  questions: [],
<<<<<<< HEAD
  allQuestions: [],
=======
>>>>>>> 1629881 (utils)
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
<<<<<<< HEAD
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
=======
>>>>>>> 1629881 (utils)
  const [score, setScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  // Fetch questions from Firebase
  const { data, isLoading, errorMessage } = useFetchFirebase("questions");
  // Set questions in state
<<<<<<< HEAD
  useMemo(() => {
    if (!isLoading && !errorMessage) {
      // select 80 random questions
      const selectedQuestions = [...data];
      selectedQuestions.sort(() => Math.random() - 0.5);
      selectedQuestions.length = 80;
      setQuestions(selectedQuestions);
      setAllQuestions(data);
      console.log("fetching questions");
    } else if (errorMessage) {
      const notify = () => toast.error(errorMessage.toString());
      notify();
=======
  useEffect(() => {
    if (!isLoading && !errorMessage) {
      // select 80 random questions
      data.sort(() => Math.random() - 0.5);
      data.length = 80;
      setQuestions(data);
>>>>>>> 1629881 (utils)
    }
  }, [data, isLoading, errorMessage]);

  return (
    <QuestionsContext.Provider
<<<<<<< HEAD
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
=======
      value={{ questions, score, setScore, userAnswers, setUserAnswers }}
    >
      {children}
>>>>>>> 1629881 (utils)
    </QuestionsContext.Provider>
  );
};
