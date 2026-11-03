import { Question, UserAnswer } from "../../../utils/types";
import { isAnswerCorrect } from "./isAnswerCorrect";

export type ReviewFilter = "all" | "correct" | "incorrect" | "bookmarked";

export type QuestionStatus = "correct" | "incorrect" | "not-answered";

export const getQuestionStatus = (
  question: Question | undefined,
  userAnswer: UserAnswer | undefined
): QuestionStatus => {
  if (!question || !userAnswer || userAnswer.answer === undefined) return "not-answered";
  return isAnswerCorrect(question, userAnswer.answer) ? "correct" : "incorrect";
};

/** "incorrect" only matches answered questions that are wrong; unanswered ones are excluded. */
export const matchesReviewFilter = (
  filter: ReviewFilter,
  question: Question | undefined,
  userAnswer: UserAnswer | undefined
): boolean => {
  switch (filter) {
    case "all":
      return true;
    case "bookmarked":
      return !!userAnswer?.isBookmarked;
    case "correct":
      return getQuestionStatus(question, userAnswer) === "correct";
    case "incorrect":
      return getQuestionStatus(question, userAnswer) === "incorrect";
  }
};
