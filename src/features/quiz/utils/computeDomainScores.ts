import { Question } from "../../../utils/types";
import { isAnswerCorrect } from "./isAnswerCorrect";

export interface DomainScore {
  domain: string;
  correct: number;
  total: number;
  percentage: number;
}

/**
 * Success rate per question `domain`. Questions without a domain are ignored;
 * unanswered questions count as incorrect. Sorted by domain name.
 */
export const computeDomainScores = (
  questions: Question[],
  userAnswers: ({ answer?: number | number[] | boolean } | undefined)[]
): DomainScore[] => {
  const byDomain = new Map<string, { correct: number; total: number }>();

  questions.forEach((question, index) => {
    const domain = question.domain?.trim();
    if (!domain) return;

    const entry = byDomain.get(domain) ?? { correct: 0, total: 0 };
    entry.total += 1;
    if (isAnswerCorrect(question, userAnswers[index]?.answer)) entry.correct += 1;
    byDomain.set(domain, entry);
  });

  return Array.from(byDomain.entries())
    .map(([domain, { correct, total }]) => ({
      domain,
      correct,
      total,
      percentage: Math.round((correct / total) * 100),
    }))
    .sort((a, b) => a.domain.localeCompare(b.domain));
};
