import { render, screen, fireEvent } from "@testing-library/react";
import QuestionNavigation from "./QuestionNavigation";
import { vi, describe, it, expect } from "vitest";

// Mock the store module
vi.mock("../../../../stores/useQuestionsStore", () => ({
  useQuestionsStore: vi.fn(),
}));

import { useQuestionsStore } from "../../../../stores/useQuestionsStore";

describe("QuestionNavigation", () => {
  it("renders correct number of buttons based on questions length", () => {
    (useQuestionsStore as any).mockReturnValue({
      userAnswers: [],
      questions: Array.from({ length: 10 }),
    });

    render(
      <QuestionNavigation
        currentQuestion={0}
        setCurrentQuestion={() => {}}
      />
    );
    expect(screen.getAllByRole("button")).toHaveLength(10);
  });

  it("renders default 80 buttons if questions empty", () => {
    (useQuestionsStore as any).mockReturnValue({
      userAnswers: [],
      questions: [],
    });

    render(
      <QuestionNavigation
        currentQuestion={0}
        setCurrentQuestion={() => {}}
      />
    );
    expect(screen.getAllByRole("button")).toHaveLength(80);
  });

  it("marks current question as active", () => {
    (useQuestionsStore as any).mockReturnValue({
        userAnswers: [],
        questions: Array.from({ length: 80 }),
    });
    render(
      <QuestionNavigation
        currentQuestion={5}
        setCurrentQuestion={() => {}}
      />
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons[5]).toHaveClass("active");
    expect(buttons[5]).toBeDisabled();
  });

  it("marks answered questions correctly", () => {
    // Mock store with sparse userAnswers
    const userAnswers = [];
    userAnswers[1] = { question: 1, answer: 1 };

    (useQuestionsStore as any).mockReturnValue({
      userAnswers,
      questions: Array.from({ length: 80 }),
    });

    render(
      <QuestionNavigation
        currentQuestion={0}
        setCurrentQuestion={() => {}}
      />
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons[1]).toHaveClass("answered");
    expect(buttons[0]).not.toHaveClass("answered");
  });

  it("marks bookmarked questions correctly", () => {
     const userAnswers = [];
     userAnswers[2] = { question: 2, answer: 1, isBookmarked: true };

     (useQuestionsStore as any).mockReturnValue({
       userAnswers,
       questions: Array.from({ length: 80 }),
     });

     render(
       <QuestionNavigation
         currentQuestion={0}
         setCurrentQuestion={() => {}}
       />
     );
     const buttons = screen.getAllByRole("button");
     expect(buttons[2]).toHaveClass("bookmarked");
   });

  it("calls setCurrentQuestion on click", () => {
    (useQuestionsStore as any).mockReturnValue({
        userAnswers: [],
        questions: Array.from({ length: 80 }),
    });
    const setCurrentQuestion = vi.fn();
    render(
      <QuestionNavigation
        currentQuestion={0}
        setCurrentQuestion={setCurrentQuestion}
      />
    );
    fireEvent.click(screen.getAllByRole("button")[10]);
    expect(setCurrentQuestion).toHaveBeenCalledWith(10);
  });
});
