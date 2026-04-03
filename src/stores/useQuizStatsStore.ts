import { create } from "zustand";
import { QuestionStat } from "../utils/types";

interface QuizStatsState {
  isTracking: boolean;
  questionStartTime: number | null;
  currentQuestionId: number | null; // This was an index, let's keep it for compatibility or rename to currentQuestionIndex if needed. 
                                     // Actually, we'll store the persistent ID in QuestionStat.
  questionStats: QuestionStat[];
  
  // Actions
  startTracking: () => void;
  startQuestion: (questionIndex: number) => void;
  endQuestion: (params: { 
    questionId: string; 
    isCorrect: boolean; 
    userAnswer: any; 
    isBookmarked: boolean; 
  }) => void;
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

  startQuestion: (questionIndex: number) => {
    const { isTracking, currentQuestionId } = get();
    if (!isTracking) return;

    // Conclude previous question if one was active (this shouldn't happen with correct flow)
    // We'll leave it as is or improve later.

    set({
      currentQuestionId: questionIndex,
      questionStartTime: Date.now(),
    });
  },

  endQuestion: ({ questionId, isCorrect, userAnswer, isBookmarked }) => {
    const { isTracking, currentQuestionId, questionStartTime, questionStats } = get();
    
    if (!isTracking || currentQuestionId === null || questionStartTime === null) {
      return; 
    }

    const timeSpentMs = Date.now() - questionStartTime;
    const newStat: QuestionStat = {
      questionId,
      timeSpentMs,
      isCorrect,
      userAnswer,
      isBookmarked,
    };

    // Filter out if user revisits same question, keep latest response
    const filteredStats = questionStats.filter(s => s.questionId !== questionId);

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
