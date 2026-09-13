import { Question } from "../../../../../utils/types";
import { normalizeText } from "../../../../../utils/helpers/normalizeText";

export interface DuplicateQuestionGroup {
  normalizedTitle: string;
  questions: Question[];
}

/**
 * Groups questions whose title is identical once accents, casing and
 * punctuation/whitespace differences are ignored. Only groups with more
 * than one question are returned, largest group first.
 */
export const findDuplicateQuestions = (
  questions: Question[]
): DuplicateQuestionGroup[] => {
  const groups = new Map<string, Question[]>();

  questions.forEach((question) => {
    const normalizedTitle = normalizeText(question.title ?? "");
    if (!normalizedTitle) return;

    const existing = groups.get(normalizedTitle);
    if (existing) {
      existing.push(question);
    } else {
      groups.set(normalizedTitle, [question]);
    }
  });

  return Array.from(groups.entries())
    .filter(([, group]) => group.length > 1)
    .map(([normalizedTitle, group]) => ({
      normalizedTitle,
      questions: group,
    }))
    .sort((a, b) => b.questions.length - a.questions.length);
};
