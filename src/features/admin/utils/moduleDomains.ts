import type { Question } from "../../../utils/types";
import { getFormationLabel } from "../../../utils/helpers/formationLabel";
import type { Module } from "../types/module.types";

export const MAX_TOTAL_PERCENT = 100;

/**
 * Keeps digits only and clamps to 0-100, so decimals, signs and letters are rejected.
 * An empty string stays empty (field cleared).
 */
export const sanitizePercentInput = (raw: string): string => {
  const digits = raw.replace(/\D/g, "");
  if (digits === "") return "";
  return String(Math.min(Number(digits), MAX_TOTAL_PERCENT));
};

/** Splits 100% across `domains`: floor(100 / N) each, remainder given +1 to the first domains. */
export const autoBalancePercents = (domains: string[]): Record<string, string> => {
  const count = domains.length;
  if (count === 0) return {};
  const base = Math.floor(MAX_TOTAL_PERCENT / count);
  const remainder = MAX_TOTAL_PERCENT % count;
  return Object.fromEntries(
    domains.map((domain, index) => [domain, String(base + (index < remainder ? 1 : 0))]),
  );
};

/** Sum of the percentages configured for `domains` (empty/missing counts as 0). */
export const totalPercent = (domains: string[], percents: Record<string, string>): number =>
  domains.reduce((sum, domain) => sum + (Number(percents[domain]) || 0), 0);

/** Distinct, sorted domains already set on the questions of a module (e.g. via CSV import). */
export const getQuestionDomains = (questions: Question[], module: Pick<Module, "title">): string[] => {
  const domains = new Set<string>();
  questions.forEach((q) => {
    const domain = q.domain?.trim();
    if (domain && getFormationLabel(q.type) === module.title) domains.add(domain);
  });
  return Array.from(domains).sort((a, b) => a.localeCompare(b));
};
