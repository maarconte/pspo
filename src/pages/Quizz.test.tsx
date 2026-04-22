import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import Quizz from "./Quizz";
import { useQuestionsStore } from "../stores/useQuestionsStore";
import { useSaveQuizSession } from "../hooks/useSaveQuizSession";
import { useUserStore } from "../stores/useUserStore";
import { useQuizStatsStore } from "../stores/useQuizStatsStore";
import { toast } from "react-toastify";
import { MemoryRouter } from "react-router-dom";
import { useCoopStore } from "../stores/useCoopStore";

// Mocking external dependencies
vi.mock("../stores/useQuestionsStore", () => ({
  useQuestionsStore: vi.fn((selector) => {
    const mockQuestions = [
      { id: "1", title: "Q1", type: "pspo-I", answerType: "S", answers: ["1", "2"], answer: 0 },
      { id: "2", title: "Q2", type: "pspo-I", answerType: "S", answers: ["1", "2"], answer: 0 },
      { id: "3", title: "Q3", type: "pspo-I", answerType: "S", answers: ["1", "2"], answer: 0 },
    ];
    const state = {
      questions: mockQuestions,
      score: 0,
      userAnswers: [],
      setScore: vi.fn(),
      formation: "pspo-I",
      calculateScore: vi.fn(() => 0),
      setAnswer: vi.fn(),
      toggleBookmark: vi.fn(),
    };
    return selector ? selector(state) : state;
  }),
}));

vi.mock("react-toastify");

vi.mock("../hooks/useSaveQuizSession", () => ({
  useSaveQuizSession: vi.fn(() => ({ mutate: vi.fn() })),
}));

vi.mock("../stores/useUserStore", () => ({
  useUserStore: vi.fn((selector) => {
    const state = {
      user: { uid: "test-uid" },
    };
    return selector ? selector(state) : state;
  }),
}));

vi.mock("../stores/useQuizStatsStore", () => ({
  useQuizStatsStore: vi.fn((selector) => {
    const state = {
      startTracking: vi.fn(),
      startQuestion: vi.fn(),
      endQuestion: vi.fn(),
      getSummary: vi.fn(() => ({
          totalQuestions: 3,
          averageTimeMs: 0,
          totalTimeMs: 0,
          details: [],
        })),
      resetStats: vi.fn(),
    };
    return selector ? selector(state) : state;
  }),
}));

vi.mock("../stores/useCoopStore", () => ({
  useCoopStore: vi.fn((selector) => {
    const state = {
      participants: [],
      currentIndex: 0,
      nextTurn: vi.fn(),
      resetTurn: vi.fn(),
      isOpen: false,
      toggleDrawer: vi.fn(),
      setOpen: vi.fn(),
    };
    return selector ? selector(state) : state;
  }),
}));

// Provide a mock for matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("Quizz Component - notifyTime", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
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
      vi.advanceTimersByTime(3000);
    });

    const nextButton = screen.getByText("Next");
    act(() => {
      fireEvent.click(nextButton);
    });

    expect(vi.mocked(toast)).not.toHaveBeenCalled();
  });

  it("does NOT trigger notifyTime toast on 'Previous' Button even if time > 3s", () => {
    render(
      <MemoryRouter>
        <Quizz />
      </MemoryRouter>
    );

    const nextButton = screen.getByText("Next");
    act(() => {
      fireEvent.click(nextButton); // Move to Q2
    });

    act(() => {
      vi.advanceTimersByTime(4000); // 4 seconds spent on Q2
    });

    const prevButton = screen.getByText("Previous");
    act(() => {
      fireEvent.click(prevButton);
    });

    expect(vi.mocked(toast)).not.toHaveBeenCalled();
  });
});

describe("Quizz Component - Coop Mode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays the current participant name based on question index (2+ participants)", () => {
    vi.mocked(useCoopStore).mockImplementation((selector: any) => {
      const state = {
        participants: ["Alice", "Bob"],
      };
      return selector ? selector(state) : state;
    });

    render(
      <MemoryRouter>
        <Quizz />
      </MemoryRouter>
    );

    // Q1 (index 0) -> Alice
    expect(screen.getByText("Alice")).toBeDefined();

    // Navigate to Q2 (index 1) -> Bob
    const nextButton = screen.getByText("Next");
    act(() => {
      fireEvent.click(nextButton);
    });
    expect(screen.getByText("Bob")).toBeDefined();

    // Navigate back to Q1 -> Alice
    const prevButton = screen.getByText("Previous");
    act(() => {
      fireEvent.click(prevButton);
    });
    expect(screen.getByText("Alice")).toBeDefined();
  });

  it("updates participant name when jumping to a question", () => {
    vi.mocked(useCoopStore).mockImplementation((selector: any) => {
      const state = {
        participants: ["Alice", "Bob", "Charlie"],
      };
      return selector ? selector(state) : state;
    });

    render(
      <MemoryRouter>
        <Quizz />
      </MemoryRouter>
    );

    // Q1 -> Alice
    expect(screen.getByText("Alice")).toBeDefined();

    // Simulate jumping to Q3 (index 2) -> Charlie
    // In Quizz.tsx, handleQuestionChange(2) would happen via Drawer.
    // We can't easily click the Drawer items here without more setup, 
    // but we can verify that the derivation logic is correct.
    // Let's use the 'Next' button twice.
    const nextButton = screen.getByText("Next");
    act(() => {
      fireEvent.click(nextButton); // Q2 -> Bob
    });
    expect(screen.getByText("Bob")).toBeDefined();
    
    act(() => {
      fireEvent.click(nextButton); // Q3 -> Charlie
    });
    expect(screen.getByText("Charlie")).toBeDefined();
  });

  it("does NOT display participant name if only one participant", () => {
    vi.mocked(useCoopStore).mockImplementation((selector: any) => {
      const state = {
        participants: ["Alice"],
      };
      return selector ? selector(state) : state;
    });

    render(
      <MemoryRouter>
        <Quizz />
      </MemoryRouter>
    );

    expect(screen.queryByText("Alice")).toBeNull();
  });

  it("does NOT display participant name if no participants", () => {
    vi.mocked(useCoopStore).mockImplementation((selector: any) => {
      const state = {
        participants: [],
      };
      return selector ? selector(state) : state;
    });

    render(
      <MemoryRouter>
        <Quizz />
      </MemoryRouter>
    );

    expect(screen.queryByText("Alice")).toBeNull();
    expect(screen.queryByText("Bob")).toBeNull();
  });
});
