import { describe, expect, it } from "vitest";
import { Question } from "../../../../../utils/types";
import { findDuplicateQuestions } from "./duplicateDetection";

const makeQuestion = (id: string, title: string): Question => ({
  id,
  title,
  feedback: "",
  answers: [],
  answerType: "S",
  answer: 0,
});

describe("findDuplicateQuestions", () => {
  it("returns no groups when every title is unique", () => {
    const questions = [
      makeQuestion("1", "What is Scrum?"),
      makeQuestion("2", "What is a Sprint?"),
    ];

    expect(findDuplicateQuestions(questions)).toEqual([]);
  });

  it("groups questions with the exact same title", () => {
    const questions = [
      makeQuestion("1", "What is Scrum?"),
      makeQuestion("2", "What is Scrum?"),
      makeQuestion("3", "What is a Sprint?"),
    ];

    const groups = findDuplicateQuestions(questions);

    expect(groups).toHaveLength(1);
    expect(groups[0].questions.map((q) => q.id)).toEqual(["1", "2"]);
  });

  it("treats accents, casing and punctuation as identical", () => {
    const questions = [
      makeQuestion("1", "Qu'est-ce qu'un Product Owner ?"),
      makeQuestion("2", "qu est ce qu un product owner"),
    ];

    const groups = findDuplicateQuestions(questions);

    expect(groups).toHaveLength(1);
    expect(groups[0].questions.map((q) => q.id)).toEqual(["1", "2"]);
  });

  it("ignores extra/leading/trailing whitespace differences", () => {
    const questions = [
      makeQuestion("1", "  What is   Scrum?  "),
      makeQuestion("2", "What is Scrum?"),
    ];

    expect(findDuplicateQuestions(questions)).toHaveLength(1);
  });

  it("sorts groups from largest to smallest", () => {
    const questions = [
      makeQuestion("1", "A"),
      makeQuestion("2", "A"),
      makeQuestion("3", "B"),
      makeQuestion("4", "B"),
      makeQuestion("5", "B"),
    ];

    const groups = findDuplicateQuestions(questions);

    expect(groups).toHaveLength(2);
    expect(groups[0].questions).toHaveLength(3);
    expect(groups[1].questions).toHaveLength(2);
  });

  it("ignores empty titles", () => {
    const questions = [makeQuestion("1", ""), makeQuestion("2", "")];

    expect(findDuplicateQuestions(questions)).toEqual([]);
  });
});
