import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import TableQuestions from "./TableQuestions";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";
import { useDeleteDoc } from "../../../../utils/hooks";
import { Question } from "../../../../utils/types";

// Mock hooks
vi.mock("../../../../stores/useQuestionsStore");

// Mock utils/hooks completely to avoid top-level Firebase initialization
vi.mock("../../../../utils/hooks", () => ({
  useDeleteDoc: vi.fn(),
  formatTimestamp: () => "formatted-date",
}));

// Mock Table component to inspect props and render cells
vi.mock("../../../../ui/Table/Table", () => ({
  default: ({ data }: any) => {
    const rows = data.getRowModel().rows;
    return (
      <div data-testid="mock-table">
        <div data-testid="row-count">{rows.length}</div>
        {rows.map((row: any) => {
           // The first column is the checkbox
           const firstCell = row.getVisibleCells()[0];
           const CellComponent = firstCell.column.columnDef.cell;
           return (
             <div key={row.id} data-testid={`row-${row.index}-checkbox`}>
               {/* Render the cell content directly.
                   flexRender would normally handle this, but here we invoke it directly or check if it's a function.
                   In the code, it's a function: ({ row }: any) => ...
               */}
               {typeof CellComponent === 'function' ? CellComponent(firstCell.getContext()) : CellComponent}
             </div>
           );
        })}
      </div>
    );
  },
}));

// Mock child components to avoid errors
vi.mock("../ModalEditQuestion/ModalEditQuestion", () => ({
  default: () => <div data-testid="modal-edit-question"></div>,
}));
vi.mock("../../../../ui/Modal/Modal", () => ({
  default: ({ children }: any) => <div data-testid="modal">{children}</div>,
}));

describe("TableQuestions", () => {
  const mockQuestions: Question[] = [
    {
      id: "q1",
      title: "Question 1",
      type: "TF",
      answerType: "TF",
      answers: [],
      answer: true,
      feedback: "",
      comments: [],
      isFlagged: false,
      createdAt: { seconds: 1600000000, nanoseconds: 0 },
      updatedAt: { seconds: 1600000000, nanoseconds: 0 },
    },
    {
      id: "q2",
      title: "Question 2",
      type: "M",
      answerType: "M",
      answers: [],
      answer: true,
      feedback: "",
      comments: [],
      isFlagged: false,
      createdAt: { seconds: 1600000000, nanoseconds: 0 },
      updatedAt: { seconds: 1600000000, nanoseconds: 0 },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useQuestionsStore).mockImplementation((selector: any) => {
        const state = {
            allQuestions: mockQuestions,
            refetch: vi.fn(),
        };
        return selector ? selector(state) : state;
    });

    vi.mocked(useDeleteDoc).mockReturnValue({
      handleDelete: vi.fn(),
      deleteMutation: {} as any,
      isLoading: false,
    });
  });

  it("renders table with questions", () => {
    render(<TableQuestions />);
    expect(screen.getByTestId("row-count")).toHaveTextContent("2");
  });

  it("handles selection of a question", async () => {
    render(<TableQuestions />);

    // Find the checkbox for the first row
    const checkboxContainer = screen.getByTestId("row-0-checkbox");
    const checkbox = checkboxContainer.querySelector("input[type='checkbox']");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    // Click to select
    fireEvent.click(checkbox!);

    // Wait for re-render
    await waitFor(() => {
        expect(checkbox).toBeChecked();
    });

    // Click to deselect
    fireEvent.click(checkbox!);
    await waitFor(() => {
        expect(checkbox).not.toBeChecked();
    });
  });
});
