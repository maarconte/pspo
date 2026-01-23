import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import QuizzScore from "./QuizzScore";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";

// Mock the store hook
vi.mock("../../../../stores/useQuestionsStore");

describe("QuizzScore", () => {
  it("should correctly calculate score for True/False questions", () => {
    const setScoreMock = vi.fn();

    // Mock store state
    const mockQuestions = [
      {
        id: "1",
        title: "Question 1 (True/False)",
        answer: true, // Correct answer is Boolean true
        type: "pspo-I",
      },
      {
        id: "2",
        title: "Question 2 (True/False)",
        answer: false, // Correct answer is Boolean false
        type: "pspo-I",
      },
      {
        id: "3",
        title: "Question 3 (Standard)",
        answer: 1, // Standard number answer
        type: "pspo-I",
      },
    ];

    const mockUserAnswers = [
      {
        question: 0, // Index of Question 1
        answer: true, // User answered true (Correct)
      },
      {
        question: 1, // Index of Question 2
        answer: true, // User answered true (Incorrect, should be false)
      },
      {
        question: 2, // Index of Question 3
        answer: 1, // User answered 1 (Correct)
      },
    ];

    // Setup the mock return value
    vi.mocked(useQuestionsStore).mockReturnValue({
      score: 0,
      setScore: setScoreMock,
      userAnswers: mockUserAnswers,
      questions: mockQuestions,
    } as any);

    render(<QuizzScore />);

    // Expect setScore to be called with 2 (Question 1 and 3 are correct)
    expect(setScoreMock).toHaveBeenCalledWith(2);
  });

  it("should handle mixed types including arrays", () => {
     const setScoreMock = vi.fn();

     const mockQuestions = [
      { id: "1", answer: [1, 2], type: "pspo-I" }, // Multiple choice
      { id: "2", answer: true, type: "pspo-I" },   // True/False
    ];

    const mockUserAnswers = [
      { question: 0, answer: [1, 2] }, // Correct
      { question: 1, answer: true },   // Correct
    ];

     vi.mocked(useQuestionsStore).mockReturnValue({
      score: 0,
      setScore: setScoreMock,
      userAnswers: mockUserAnswers,
      questions: mockQuestions,
    } as any);

    render(<QuizzScore />);
    expect(setScoreMock).toHaveBeenCalledWith(2);
  });
});
