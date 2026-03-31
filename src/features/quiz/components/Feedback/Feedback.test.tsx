import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import Feedback from "./Feedback";
import { useUpdateDoc } from "../../../../utils/hooks/";
import { toast } from "react-toastify";

// Mock the hooks and toast
vi.mock("../../../../utils/hooks/", () => ({
  useUpdateDoc: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

// Mock Lucide icons to avoid rendering issues in tests
vi.mock("lucide-react", () => ({
  AlertTriangle: () => <div data-testid="alert-icon" />,
  X: () => <div data-testid="x-icon" />,
}));

describe("Feedback Component", () => {
  const mockHandleUpdate = vi.fn();
  const mockQuestion = {
    id: "q1",
    feedback: "Correct answer because of Scrum Guide.",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useUpdateDoc as any).mockReturnValue({
      data: { comments: [] },
      error: null,
      handleUpdate: mockHandleUpdate,
    });
  });

  it("renders feedback content and report button", () => {
    render(<Feedback question={mockQuestion} />);

    expect(screen.getByText("Feedback")).toBeDefined();
    expect(screen.getByText(mockQuestion.feedback)).toBeDefined();
    expect(screen.getByText("Report a problem")).toBeDefined();
  });

  it("opens the modal when 'Report a problem' is clicked", () => {
    render(<Feedback question={mockQuestion} />);

    const reportButton = screen.getByText("Report a problem");
    fireEvent.click(reportButton);

    expect(screen.getByText("If you believe this answer is inappropriate or should be reviewed, please let us know.")).toBeDefined();
    expect(screen.getByLabelText("Please describe the issue")).toBeDefined();
  });

  it("calls handleUpdate with correct data when submitting a report", async () => {
    render(<Feedback question={mockQuestion} />);

    // Open modal
    fireEvent.click(screen.getByText("Report a problem"));

    // Type comment
    const input = screen.getByLabelText("Please describe the issue");
    fireEvent.change(input, { target: { value: "Wrong explanation" } });

    // Submit
    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    expect(mockHandleUpdate).toHaveBeenCalledWith({
      comments: ["Wrong explanation"],
      isFlagged: true,
    });

    // Modal should close (check for text that was in the modal)
    await waitFor(() => {
      expect(screen.queryByLabelText("Please describe the issue")).toBeNull();
    });

    expect(toast.success).toHaveBeenCalledWith("The problem has been reported");
  });

  it("appends comment to existing ones", async () => {
    (useUpdateDoc as any).mockReturnValue({
      data: { comments: ["First issue"] },
      error: null,
      handleUpdate: mockHandleUpdate,
    });

    render(<Feedback question={mockQuestion} />);

    fireEvent.click(screen.getByText("Report a problem"));
    fireEvent.change(screen.getByLabelText("Please describe the issue"), { 
      target: { value: "Second issue" } 
    });
    fireEvent.click(screen.getByText("Submit"));

    expect(mockHandleUpdate).toHaveBeenCalledWith({
      comments: ["First issue", "Second issue"],
      isFlagged: true,
    });
  });

  it("shows error toast if update fails", async () => {
    // Note: The component handles error via useEffect when 'error' state changes
    const { rerender } = render(<Feedback question={mockQuestion} />);

    // Mock update doc returning an error
    (useUpdateDoc as any).mockReturnValue({
      data: { comments: [] },
      error: new Error("Update failed"),
      handleUpdate: mockHandleUpdate,
    });

    // Re-render to trigger useEffect
    rerender(<Feedback question={mockQuestion} />);

    expect(toast.error).toHaveBeenCalledWith("An error occurred while updating the question");
  });
});
