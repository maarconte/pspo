import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import Quizz from "./Quizz";
import { useQuestionsStore } from "../stores/useQuestionsStore";
import { useSaveQuizSession } from "../hooks/useSaveQuizSession";
import { useUserStore } from "../stores/useUserStore";
import { useQuizStatsStore } from "../stores/useQuizStatsStore";
import { toast } from "react-toastify";
import { MemoryRouter } from "react-router-dom";

// Mocking external dependencies
vi.mock("../stores/useQuestionsStore", () => ({
  useQuestionsStore: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: vi.fn(),
}));

vi.mock("../hooks/useSaveQuizSession", () => ({
  useSaveQuizSession: vi.fn(),
}));

vi.mock("../stores/useUserStore", () => ({
  useUserStore: vi.fn(),
}));

vi.mock("../stores/useQuizStatsStore", () => ({
  useQuizStatsStore: vi.fn(),
}));

// Provide a mock for matchMedia (often required by UI libraries like rsuite in JSDOM)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("Quizz Component - notifyTime", () => {
  const mockSetScore = vi.fn();
  const mockQuestions = [
    { id: "1", title: "Q1", type: "pspo-I", answerType: "S", answers: ["1", "2"], answer: 0 },
    { id: "2", title: "Q2", type: "pspo-I", answerType: "S", answers: ["1", "2"], answer: 0 },
    { id: "3", title: "Q3", type: "pspo-I", answerType: "S", answers: ["1", "2"], answer: 0 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    (useQuestionsStore as any).mockReturnValue({
      questions: mockQuestions,
      setScore: mockSetScore,
      formation: "pspo-I",
      calculateScore: vi.fn(() => 0),
    });

    (useSaveQuizSession as any).mockReturnValue({
      mutate: vi.fn(),
    });

    (useUserStore as any).mockReturnValue({
      user: { uid: "test-uid" },
    });

    (useQuizStatsStore as any).mockReturnValue({
      startTracking: vi.fn(),
      startQuestion: vi.fn(),
      endQuestion: vi.fn(),
      getSummary: vi.fn(() => ({
        totalQuestions: 0,
        averageTimeMs: 0,
        totalTimeMs: 0,
        details: [],
      })),
      resetStats: vi.fn(),
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("does NOT trigger notifyTime toast if time spent is 3 seconds or less (Next Button)", () => {
    render(
      <MemoryRouter>
        <Quizz />
      </MemoryRouter>
    );

    act(() => {
      vi.advanceTimersByTime(3000); // exactly 3 seconds
    });

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(toast).not.toHaveBeenCalled();
  });

  it("triggers notifyTime toast if time spent is strictly greater than 3 seconds (Next Button)", () => {
    render(
      <MemoryRouter>
        <Quizz />
      </MemoryRouter>
    );

    act(() => {
      vi.advanceTimersByTime(4000); // 4 seconds
    });

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(toast).toHaveBeenCalledTimes(1);
    // Validate that it configures 'success' type since time < 45s
    // (User removed 'type' property from toast options, so we omit this check)
    const toastConfig = (toast as any).mock.calls[0][1];
    expect(toastConfig).toBeDefined();
  });

  it("does NOT trigger notifyTime toast on 'Previous' Button even if time > 3s", () => {
    render(
      <MemoryRouter>
        <Quizz />
      </MemoryRouter>
    );

    // Initial load: navigate to Q2 immediately
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton); // Transition from Q1 to Q2 (time 0s)
    
    act(() => {
      vi.advanceTimersByTime(10000); // Wait 10 seconds on Q2
    });

    const prevButton = screen.getByText("Previous");
    fireEvent.click(prevButton);

    // Toast from NEXT was 0s, so not called. 
    // Toast from PREVIOUS was 10s, but should be suppressed by shouldNotify=false.
    expect(toast).not.toHaveBeenCalled();
  });
});
