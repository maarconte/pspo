import { describe, expect, it } from "vitest";
import { Question } from "../../../utils/types";
import { matchesReviewFilter } from "./reviewFilter";

const q: Question = {
  id: "1",
  title: "t",
  feedback: "",
  answers: [],
  answerType: "S",
  answer: 1,
};

describe("matchesReviewFilter", () => {
  it("matches everything for 'all'", () => {
    expect(matchesReviewFilter("all", q, undefined)).toBe(true);
  });

  it("separates correct from incorrect, excluding unanswered from both", () => {
    const right = { question: 0, answer: 1 };
    const wrong = { question: 0, answer: 0 };

    expect(matchesReviewFilter("correct", q, right)).toBe(true);
    expect(matchesReviewFilter("correct", q, wrong)).toBe(false);
    expect(matchesReviewFilter("incorrect", q, wrong)).toBe(true);
    expect(matchesReviewFilter("incorrect", q, undefined)).toBe(false);
    expect(matchesReviewFilter("correct", q, undefined)).toBe(false);
    expect(matchesReviewFilter("incorrect", q, right)).toBe(false);
  });

  it("matches bookmarked questions only", () => {
    expect(matchesReviewFilter("bookmarked", q, { question: 0, answer: 1, isBookmarked: true })).toBe(true);
    expect(matchesReviewFilter("bookmarked", q, { question: 0, answer: 1 })).toBe(false);
  });
});
