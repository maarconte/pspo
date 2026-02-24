import { render, screen } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import TableQuestions from "./TableQuestions";
import { Question } from "../../../../utils/types";

// Mock data
const mockQuestions: Question[] = [
  {
    id: "1",
    title: "Test Question 1",
    type: "pspo-I",
    answerType: "S",
    isFlagged: false,
    updatedAt: { seconds: 1672531200, nanos: 0 },
    createdAt: { seconds: 1672531200, nanos: 0 },
    answers: [],
    correctAnswer: 0,
    explanation: "",
    feedback: "feedback"
  },
  {
    id: "2",
    title: "Test Question 2",
    type: "pspo-II",
    answerType: "M",
    isFlagged: true,
    updatedAt: { seconds: 1672531200, nanos: 0 },
    createdAt: { seconds: 1672531200, nanos: 0 },
    answers: [],
    correctAnswer: 0,
    explanation: "",
    feedback: null
  },
];

// Mock dependencies
vi.mock("../../../../stores/useQuestionsStore", () => ({
  useQuestionsStore: (selector?: any) => {
    const state = {
      allQuestions: [
        {
          id: "1",
          title: "Test Question 1",
          type: "pspo-I",
          answerType: "S",
          isFlagged: false,
          updatedAt: { seconds: 1672531200, nanos: 0 },
          createdAt: { seconds: 1672531200, nanos: 0 },
          answers: [],
          correctAnswer: 0,
          explanation: "",
          feedback: "feedback"
        },
        {
          id: "2",
          title: "Test Question 2",
          type: "pspo-II",
          answerType: "M",
          isFlagged: true,
          updatedAt: { seconds: 1672531200, nanos: 0 },
          createdAt: { seconds: 1672531200, nanos: 0 },
          answers: [],
          correctAnswer: 0,
          explanation: "",
          feedback: null
        },
      ],
      refetch: vi.fn(),
      questions: [], // TableActions might access this
    };
    if (selector) {
      return selector(state);
    }
    return state;
  },
}));

vi.mock("../../../../utils/hooks", () => ({
  useDeleteDoc: () => ({ handleDelete: vi.fn() }),
  useAddDoc: () => ({ handleAdd: vi.fn() }),
  useUpdateDoc: () => ({ handleUpdate: vi.fn() }),
  formatTimestamp: () => "01/01/2023",
}));

describe("TableQuestions", () => {
  it("renders table with questions", () => {
    render(<TableQuestions />);

    expect(screen.getByText("Test Question 1")).toBeInTheDocument();
    expect(screen.getByText("Test Question 2")).toBeInTheDocument();
    expect(screen.getByText("pspo-I")).toBeInTheDocument();
    expect(screen.getByText("pspo-II")).toBeInTheDocument();
  });
});
