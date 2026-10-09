import { Question } from "../../../utils/types";

/** Whether the user's answer matches the question's expected answer (order-insensitive for multi-answer). */
export const isAnswerCorrect = (
  question: Question,
  userAnswer: number | number[] | boolean | undefined
): boolean => {
  if (userAnswer === undefined) return false;
  const correct = question.answer;

  if (Array.isArray(correct) && Array.isArray(userAnswer)) {
    if (correct.length !== userAnswer.length) return false;
    const sortedCorrect = [...correct].sort();
    const sortedUser = [...userAnswer].sort();
    return sortedCorrect.every((val, idx) => val === sortedUser[idx]);
  }
  return correct === userAnswer;
};
