import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import QuestionCard from "./QuestionCard";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";

// Mock the store hook
vi.mock("../../../../stores/useQuestionsStore", () => ({
  useQuestionsStore: vi.fn(),
}));

describe("QuestionCard", () => {
  const mockSetAnswer = vi.fn();
  const mockToggleBookmark = vi.fn();

  const standardQuestion = {
    id: "1",
    title: "What is Scrum?",
    answers: ["A framework", "A methodology", "A process"],
    answerType: "R",
    answer: 0,
    feedback: "Scrum is a framework.",
  };

  const tfQuestion = {
    id: "2",
    title: "Is Scrum agile?",
    answerType: "TF",
    answer: true,
    feedback: "Yes.",
  };

  const multiQuestion = {
    id: "3",
    title: "Select Scrum values",
    answers: ["Focus", "Commitment", "Speed", "Respect"],
    answerType: "M",
    answer: [0, 1, 3],
    feedback: "Focus, Commitment, Openness, Respect, Courage.",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not have any answer selected initially when store is empty", () => {
    vi.mocked(useQuestionsStore).mockImplementation((selector) => {
      const state = {
        userAnswers: [],
        setAnswer: mockSetAnswer,
        toggleBookmark: mockToggleBookmark,
      };
      return selector(state);
    });

    render(
      <QuestionCard
        question={standardQuestion}
        currentQuestion={0}
        showAnswer={false}
      />
    );

    const radioButtons = screen.getAllByRole("radio");
    radioButtons.forEach((radio) => {
      expect(radio).not.toBeChecked();
    });
  });

  it("should correctly record a radio button answer", () => {
    vi.mocked(useQuestionsStore).mockImplementation((selector) => {
      const state = {
        userAnswers: [],
        setAnswer: mockSetAnswer,
        toggleBookmark: mockToggleBookmark,
      };
      return selector(state);
    });

    render(
      <QuestionCard
        question={standardQuestion}
        currentQuestion={0}
        showAnswer={false}
      />
    );

    const firstAnswer = screen.getByLabelText("A framework");
    fireEvent.click(firstAnswer);

    expect(mockSetAnswer).toHaveBeenCalledWith(0, 0);
  });

  it("should correctly record a True/False answer", () => {
    vi.mocked(useQuestionsStore).mockImplementation((selector) => {
      const state = {
        userAnswers: [],
        setAnswer: mockSetAnswer,
        toggleBookmark: mockToggleBookmark,
      };
      return selector(state);
    });

    render(
      <QuestionCard
        question={tfQuestion}
        currentQuestion={1}
        showAnswer={false}
      />
    );

    const trueButton = screen.getByLabelText("True");
    fireEvent.click(trueButton);

    expect(mockSetAnswer).toHaveBeenCalledWith(1, true);
  });

  it("should handle multiple choice selections correctly", () => {
    vi.mocked(useQuestionsStore).mockImplementation((selector) => {
      // Mock state where the first option is already selected at index 2
      const mockUserAnswers = [];
      mockUserAnswers[2] = { question: 2, answer: [0] };
      
      const state = {
        userAnswers: mockUserAnswers,
        setAnswer: mockSetAnswer,
        toggleBookmark: mockToggleBookmark,
      };
      return selector(state);
    });

    render(
      <QuestionCard
        question={multiQuestion}
        currentQuestion={2}
        showAnswer={false}
      />
    );

    const secondOption = screen.getByLabelText("Commitment");
    fireEvent.click(secondOption);

    // Should call setAnswer with [0, 1]
    expect(mockSetAnswer).toHaveBeenCalledWith(2, [0, 1]);
  });

  it("should toggle bookmark when clicking the bookmark icon", () => {
    vi.mocked(useQuestionsStore).mockImplementation((selector) => {
      const state = {
        userAnswers: [],
        setAnswer: mockSetAnswer,
        toggleBookmark: mockToggleBookmark,
      };
      return selector(state);
    });

    render(
      <QuestionCard
        question={standardQuestion}
        currentQuestion={0}
        showAnswer={false}
      />
    );

    // Find the bookmark element (it's a Lucide icon, checking for class or data-testid could work, 
    // but here I'll just look for the SVG element that holds clicking logic)
    const bookmark = document.querySelector(".bookmark");
    if (bookmark) fireEvent.click(bookmark);

    expect(mockToggleBookmark).toHaveBeenCalledWith(0);
  });
});
