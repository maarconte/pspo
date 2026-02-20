import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TableActions from "./TableActions";
import { useQuestionsStore } from "../../../stores/useQuestionsStore";
import { useAddDoc, useDeleteDoc, useDeleteDocs } from "../../../utils/hooks";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock hooks with factory to prevent actual file execution
vi.mock("../../../utils/hooks", () => ({
  useAddDoc: vi.fn(),
  useDeleteDoc: vi.fn(),
  useDeleteDocs: vi.fn(),
  formatTimestamp: vi.fn(),
  useFetchFirebase: vi.fn(),
  useUpdateDoc: vi.fn(),
}));

vi.mock("../../../stores/useQuestionsStore");

vi.mock("../../FileUploader", () => ({ default: () => <div data-testid="file-uploader" /> }));
vi.mock("../../../features/admin/components/ModalEditQuestion/ModalEditQuestion", () => ({ default: () => <div data-testid="modal-edit-question" /> }));

// Mock Modal since it might use portals or complex logic
vi.mock("../../Modal", () => ({
  default: ({ isOpen, onConfirm, children, title }: any) => {
    if (!isOpen) return null;
    return (
      <div data-testid="mock-modal">
        <h1>{title}</h1>
        <div>{children}</div>
        <button onClick={onConfirm}>Confirm Delete</button>
      </div>
    );
  }
}));

describe("TableActions", () => {
  const mockSetSelectedQuestions = vi.fn();
  const mockSetSelectedQuestion = vi.fn();
  const mockSetIsSelectAll = vi.fn();
  const mockSetIsSelectNone = vi.fn();
  const mockHandleDeleteDocs = vi.fn();
  const mockHandleDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useQuestionsStore as any).mockReturnValue({
      questions: [],
      refetch: vi.fn(),
    });
    (useDeleteDoc as any).mockReturnValue({ handleDelete: mockHandleDelete });
    (useDeleteDocs as any).mockReturnValue({ handleDeleteDocs: mockHandleDeleteDocs });
    (useAddDoc as any).mockReturnValue({ handleAdd: vi.fn() });
  });

  it("should call handleDeleteDocs when deleting multiple questions", async () => {
    const selectedQuestions = [
      { id: "1", title: "Q1" } as any,
      { id: "2", title: "Q2" } as any,
    ];

    render(
      <TableActions
        selectedQuestions={selectedQuestions}
        setSelectedQuestions={mockSetSelectedQuestions}
        setSelectedQuestion={mockSetSelectedQuestion}
        setIsSelectAll={mockSetIsSelectAll}
        setIsSelectNone={mockSetIsSelectNone}
      />
    );

    // Click Delete button to open modal
    const deleteBtn = screen.getByText("Delete");
    fireEvent.click(deleteBtn);

    // Expect Mock Modal to be visible
    expect(screen.getByTestId("mock-modal")).toBeInTheDocument();

    // Click confirm
    const confirmBtn = screen.getByText("Confirm Delete");
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockHandleDeleteDocs).toHaveBeenCalledWith(["1", "2"]);
    });

    // Ensure single delete was NOT called
    expect(mockHandleDelete).not.toHaveBeenCalled();

    // Ensure selection is cleared
    expect(mockSetSelectedQuestions).toHaveBeenCalledWith([]);
  });
});
