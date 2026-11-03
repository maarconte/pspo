import { Question } from "../../../utils/types";
import { isAnswerCorrect } from "./isAnswerCorrect";

export interface DomainScore {
  domain: string;
  correct: number;
  total: number;
  percentage: number;
}

export const NO_DOMAIN_LABEL = "Questions without domain";

/**
 * Success rate per question `domain`; unanswered questions count as incorrect.
 * Sorted by domain name, with questions lacking a domain grouped last under
 * `NO_DOMAIN_LABEL`. Returns an empty list when no question has a domain.
 */
export const computeDomainScores = (
  questions: Question[],
  userAnswers: ({ answer?: number | number[] | boolean } | undefined)[]
): DomainScore[] => {
  const byDomain = new Map<string, { correct: number; total: number }>();
  const noDomain = { correct: 0, total: 0 };

  questions.forEach((question, index) => {
    const domain = question.domain?.trim();
    const entry = domain ? (byDomain.get(domain) ?? { correct: 0, total: 0 }) : noDomain;
    entry.total += 1;
    if (isAnswerCorrect(question, userAnswers[index]?.answer)) entry.correct += 1;
    if (domain) byDomain.set(domain, entry);
  });

  if (byDomain.size === 0) return [];

  const toScore = (domain: string, { correct, total }: { correct: number; total: number }): DomainScore => ({
    domain,
    correct,
    total,
    percentage: Math.round((correct / total) * 100),
  });

  const scores = Array.from(byDomain.entries())
    .map(([domain, counts]) => toScore(domain, counts))
    .sort((a, b) => a.domain.localeCompare(b.domain));

  return noDomain.total > 0 ? [...scores, toScore(NO_DOMAIN_LABEL, noDomain)] : scores;
};
