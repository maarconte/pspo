import type { QuestionComment } from "../types";

export const createComment = (text: string): QuestionComment => ({
  text,
  createdAt: new Date().toISOString(),
});

export const getCommentText = (comment: QuestionComment): string =>
  typeof comment === "string" ? comment : comment.text;

/** Publication date, formatted for display. Legacy string comments have none. */
export const getCommentDate = (comment: QuestionComment): string | null => {
  if (typeof comment === "string") return null;
  const date = new Date(comment.createdAt);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
