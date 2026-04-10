import { AnswerStatus } from "../components/QuestionAnswer/QuestionAnswer.types";

/** Maps answerType to the HTML input type. */
export const getInputType = (answerType: string): "radio" | "checkbox" =>
  answerType === "M" ? "checkbox" : "radio";

/** Returns true if the user selected this answer index. */
export const isUserChoice = (question: any, userAnswer: any, index: number): boolean => {
  if (question.answerType === "TF") {
    return (userAnswer === true && index === 0) || (userAnswer === false && index === 1);
  }
  if (Array.isArray(userAnswer)) return userAnswer.includes(index);
  return userAnswer === index;
};

/** Computes the display status of an answer relative to the correct answer. */
export const getAnswerStatus = (question: any, userAnswer: any, index: number): AnswerStatus => {
  const isCorrect =
    question.answerType === "TF"
      ? (index === 0) === question.answer
      : Array.isArray(question.answer)
        ? question.answer.includes(index)
        : question.answer === index;

  const selected = isUserChoice(question, userAnswer, index);

  if (isCorrect) return selected ? "success" : "missed";
  if (selected) return "error";
  return "default";
};

/** Returns the label text for a given answer index. */
export const getAnswerLabel = (question: any, index: number): string => {
  if (question.answerType === "TF") return index === 0 ? "True" : "False";
  return question.answers?.[index] ?? "";
};
