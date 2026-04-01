export interface QuestionStat {
  questionId: number; // Index in the quiz array or actual ID
  timeSpentMs: number;
  isCorrect: boolean;
}

export interface QuizSessionStat {
  id?: string;
  userId: string;
  formation: string;
  score: number;
  totalQuestions: number;
  averageTimeMs: number;
  totalTimeMs: number;
  timestamp: number;
  details: QuestionStat[];
}
