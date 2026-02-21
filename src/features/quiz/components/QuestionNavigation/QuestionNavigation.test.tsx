import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import QuestionNavigation from "./QuestionNavigation";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";

// Mock the store hook
vi.mock("../../../../stores/useQuestionsStore");

describe("QuestionNavigation", () => {
  it("should render 80 buttons", () => {
    vi.mocked(useQuestionsStore).mockReturnValue({
      userAnswers: [],
    } as any);

    render(
      <QuestionNavigation
        currentQuestion={0}
        setCurrentQuestion={() => {}}
      />
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(80);
  });

  it("should mark the current question as active", () => {
    vi.mocked(useQuestionsStore).mockReturnValue({
      userAnswers: [],
    } as any);

    render(
      <QuestionNavigation
        currentQuestion={5}
        setCurrentQuestion={() => {}}
      />
    );

    const button6 = screen.getByText("6");
    expect(button6.className).toContain("active");
  });

  it("should mark answered questions correctly", () => {
    const mockUserAnswers = [];
    mockUserAnswers[2] = { question: 2, answer: 1 }; // Question 3 answered

    vi.mocked(useQuestionsStore).mockReturnValue({
      userAnswers: mockUserAnswers,
    } as any);

    render(
      <QuestionNavigation
        currentQuestion={0}
        setCurrentQuestion={() => {}}
      />
    );

    const button3 = screen.getByText("3");
    expect(button3.className).toContain("answered");

    const button4 = screen.getByText("4");
    expect(button4.className).not.toContain("answered");
  });

  it("should mark bookmarked questions correctly", () => {
    const mockUserAnswers = [];
    mockUserAnswers[3] = { question: 3, answer: 1, isBookmarked: true }; // Question 4 bookmarked

    vi.mocked(useQuestionsStore).mockReturnValue({
      userAnswers: mockUserAnswers,
    } as any);

    render(
      <QuestionNavigation
        currentQuestion={0}
        setCurrentQuestion={() => {}}
      />
    );

    const button4 = screen.getByText("4");
    expect(button4.className).toContain("bookmarked");
  });

  it("should call setCurrentQuestion when clicked", () => {
    const setCurrentQuestionMock = vi.fn();
    vi.mocked(useQuestionsStore).mockReturnValue({
      userAnswers: [],
    } as any);

    render(
      <QuestionNavigation
        currentQuestion={0}
        setCurrentQuestion={setCurrentQuestionMock}
      />
    );

    const button10 = screen.getByText("10");
    fireEvent.click(button10);

    expect(setCurrentQuestionMock).toHaveBeenCalledWith(9); // 0-based index
  });
});
