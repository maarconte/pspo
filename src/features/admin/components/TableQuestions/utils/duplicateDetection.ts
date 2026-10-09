import { Question } from "../../../../../utils/types";
import { normalizeText } from "../../../../../utils/helpers/normalizeText";

export interface DuplicateQuestionGroup {
  normalizedTitle: string;
  questions: Question[];
}

/**
 * Groups questions whose title is identical once accents, casing and
 * punctuation/whitespace differences are ignored. Questions living in
 * different modules (`Question.type`) are never considered duplicates of each
 * other. Only groups with more than one question are returned, largest group
 * first.
 */
export const findDuplicateQuestions = (
  questions: Question[]
): DuplicateQuestionGroup[] => {
  const groups = new Map<string, Question[]>();

  questions.forEach((question) => {
    const normalizedTitle = normalizeText(question.title ?? "");
    if (!normalizedTitle) return;

    const key = `${question.type ?? ""}\u0000${normalizedTitle}`;
    const existing = groups.get(key);
    if (existing) {
      existing.push(question);
    } else {
      groups.set(key, [question]);
    }
  });

  return Array.from(groups.entries())
    .filter(([, group]) => group.length > 1)
    .map(([, group]) => ({
      normalizedTitle: normalizeText(group[0].title ?? ""),
      questions: group,
    }))
    .sort((a, b) => b.questions.length - a.questions.length);
};
