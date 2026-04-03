export interface QuestionStat {
  questionId: string; // The Firestore document ID of the question
  timeSpentMs: number;
  isCorrect: boolean;
  userAnswer: any;
  isBookmarked: boolean;
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
