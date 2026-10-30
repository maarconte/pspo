import type { Question } from "../../../utils/types";
import { getFormationLabel } from "../../../utils/helpers/formationLabel";
import type { Module } from "../types/module.types";

/** Distinct, sorted domains already set on the questions of a module (e.g. via CSV import). */
export const getQuestionDomains = (questions: Question[], module: Pick<Module, "title">): string[] => {
  const domains = new Set<string>();
  questions.forEach((q) => {
    const domain = q.domain?.trim();
    if (domain && getFormationLabel(q.type) === module.title) domains.add(domain);
  });
  return Array.from(domains).sort((a, b) => a.localeCompare(b));
};
