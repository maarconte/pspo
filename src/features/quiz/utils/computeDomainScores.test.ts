import { describe, expect, it } from "vitest";
import { Question } from "../../../utils/types";
import { computeDomainScores } from "./computeDomainScores";

const q = (id: string, answer: Question["answer"], domain?: string): Question => ({
  id,
  title: id,
  feedback: "",
  answers: [],
  answerType: "S",
  answer,
  domain,
});

describe("computeDomainScores", () => {
  it("returns an empty list when no question has a domain", () => {
    expect(computeDomainScores([q("1", 0), q("2", 1)], [{ answer: 0 }, { answer: 1 }])).toEqual([]);
  });

  it("computes the percentage per domain and counts unanswered as incorrect", () => {
    const questions = [q("1", 0, "Scrum"), q("2", 1, "Scrum"), q("3", [0, 2], "Product"), q("4", 0, "Product")];
    const answers = [{ answer: 0 }, { answer: 0 }, { answer: [2, 0] }, undefined];

    expect(computeDomainScores(questions, answers)).toEqual([
      { domain: "Product", correct: 1, total: 2, percentage: 50 },
      { domain: "Scrum", correct: 1, total: 2, percentage: 50 },
    ]);
  });

  it("ignores questions without a domain", () => {
    const scores = computeDomainScores([q("1", 0, "Scrum"), q("2", 0)], [{ answer: 0 }, { answer: 0 }]);
    expect(scores).toEqual([{ domain: "Scrum", correct: 1, total: 1, percentage: 100 }]);
  });
});
