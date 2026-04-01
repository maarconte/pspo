import { create } from "zustand";
import { QuestionStat } from "../utils/types";

interface QuizStatsState {
  isTracking: boolean;
  questionStartTime: number | null;
  currentQuestionId: number | null;
  questionStats: QuestionStat[];
  
  // Actions
  startTracking: () => void;
  startQuestion: (questionId: number) => void;
  endQuestion: (isCorrect?: boolean) => void;
  resetStats: () => void;
  getSummary: () => {
    totalQuestions: number;
    totalTimeMs: number;
    averageTimeMs: number;
    details: QuestionStat[];
  };
}

export const useQuizStatsStore = create<QuizStatsState>((set, get) => ({
  isTracking: false,
  questionStartTime: null,
  currentQuestionId: null,
  questionStats: [],

  startTracking: () => {
    set({
      isTracking: true,
      questionStartTime: null,
      currentQuestionId: null,
      questionStats: [],
    });
  },

  startQuestion: (questionId: number) => {
    const { isTracking, endQuestion, currentQuestionId } = get();
    if (!isTracking) return;

    // Conclude previous question if one was active
    if (currentQuestionId !== null) {
      endQuestion();
    }

    set({
      currentQuestionId: questionId,
      questionStartTime: Date.now(),
    });
  },

  endQuestion: (isCorrect = false) => {
    const { isTracking, currentQuestionId, questionStartTime, questionStats } = get();
    
    if (!isTracking || currentQuestionId === null || questionStartTime === null) {
      return; 
    }

    const timeSpentMs = Date.now() - questionStartTime;
    const newStat: QuestionStat = {
      questionId: currentQuestionId,
      timeSpentMs,
      isCorrect,
    };

    // Filter out if user revisits same question, keep latest response
    const filteredStats = questionStats.filter(s => s.questionId !== currentQuestionId);

    set({
      questionStats: [...filteredStats, newStat],
      currentQuestionId: null,
      questionStartTime: null,
    });
  },

  resetStats: () => {
    set({
      isTracking: false,
      questionStartTime: null,
      currentQuestionId: null,
      questionStats: [],
    });
  },

  getSummary: () => {
    const { questionStats } = get();
    
    // In case there is an active question when finishing
    // We expect endQuestion to be called before getSummary
    const totalQuestions = questionStats.length;
    const totalTimeMs = questionStats.reduce((acc, curr) => acc + curr.timeSpentMs, 0);
    const averageTimeMs = totalQuestions > 0 ? totalTimeMs / totalQuestions : 0;

    return {
      totalQuestions,
      totalTimeMs,
      averageTimeMs,
      details: questionStats,
    };
  }
}));
