import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TableActions from "./TableActions";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Papa from "papaparse";
import { toast } from "react-toastify";

// Mock dependencies
const mockHandleAdd = vi.fn();
const mockHandleDelete = vi.fn();
const mockRefetch = vi.fn();

vi.mock("../../../utils/hooks", () => ({
  useAddDoc: () => ({
    handleAdd: mockHandleAdd,
  }),
  useDeleteDoc: () => ({
    handleDelete: mockHandleDelete,
  }),
}));

vi.mock("../../../stores/useQuestionsStore", () => ({
  useQuestionsStore: () => ({
    questions: [],
    refetch: mockRefetch,
  }),
}));

vi.mock("papaparse", () => ({
  default: {
    parse: vi.fn(),
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock FileUploader component since we only need to trigger handleFile
vi.mock("../../FileUploader", () => ({
  default: ({ handleFile }: { handleFile: (file: any) => void }) => (
    <button
      data-testid="mock-file-uploader"
      onClick={() => handleFile(new File(["content"], "test.csv"))}
    >
      Upload
    </button>
  ),
}));

// Mock ModalEditQuestion
vi.mock("../../../features/admin/components/ModalEditQuestion/ModalEditQuestion", () => ({
  default: () => <div data-testid="modal-edit-question" />,
}));

// Mock Modal
vi.mock("../../Modal", () => ({
  default: () => <div data-testid="modal" />,
}));

describe("TableActions", () => {
  const defaultProps = {
    selectedQuestions: [],
    setSelectedQuestions: vi.fn(),
    setIsSelectAll: vi.fn(),
    setIsSelectNone: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should add all questions from CSV and wait for completion", async () => {
    // Mock Papa.parse to return data immediately
    (Papa.parse as any).mockImplementation((file: any, config: any) => {
      config.complete({
        data: [
          { question: "Q1", answer: "A1", answerType: "S" },
          { question: "Q2", answer: "A2", answerType: "S" },
        ],
      });
    });

    // Mock handleAdd with delay
    mockHandleAdd.mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return {};
    });

    render(<TableActions {...defaultProps} />);

    // Simulate file upload
    fireEvent.click(screen.getByTestId("mock-file-uploader"));

    // Check if "Add 2 questions" button appears
    await waitFor(() => {
      expect(screen.getByText("Add 2 questions")).toBeInTheDocument();
    });

    // Click "Add 2 questions"
    fireEvent.click(screen.getByText("Add 2 questions"));

    // Verify handleAdd is called immediately (synchronously in loop)
    expect(mockHandleAdd).toHaveBeenCalledTimes(2);

    // Verify toast is NOT called immediately (this should FAIL with current code)
    expect(toast.success).not.toHaveBeenCalled();

    // Wait for completion
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("The questions have been added");
    });
  });
});
