import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ModalEditQuestion from "./ModalEditQuestion";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";
import { useAddDoc, useUpdateDoc } from "../../../../utils/hooks";
import { toast } from "react-toastify";

// Mock hooks
vi.mock("../../../../stores/useQuestionsStore");
vi.mock("../../../../utils/hooks", () => ({
  useAddDoc: vi.fn(),
  useUpdateDoc: vi.fn(),
}));
vi.mock("react-toastify");
vi.mock("../../../../ui/Modal/Modal", () => ({
  default: ({ children, onConfirm, title }: any) => (
    <div data-testid="modal">
      <h1>{title}</h1>
      {children}
      <button onClick={onConfirm} data-testid="save-button">
        Save
      </button>
    </div>
  ),
}));

// Mock child components that strictly rely on Formik context or complex props
vi.mock("../SelectAnswerType/SelectAnswerType", () => ({
  default: () => <div data-testid="select-answer-type">Mock SelectAnswerType</div>,
}));

describe("ModalEditQuestion", () => {
  it("should call handleUpdate and show toast on form submission", async () => {
    const handleUpdateMock = vi.fn();
    const refetchMock = vi.fn();
    const setIsOpenMock = vi.fn();
    const setSelectQuestionMock = vi.fn();

    // Mock store
    vi.mocked(useQuestionsStore).mockReturnValue({
      refetch: refetchMock,
    } as any);

    // Mock hooks
    vi.mocked(useAddDoc).mockReturnValue({
      handleAdd: vi.fn(),
    } as any);

    vi.mocked(useUpdateDoc).mockReturnValue({
      handleUpdate: handleUpdateMock.mockResolvedValue("success"),
      error: null,
    } as any);

    const mockQuestion = {
      id: "123",
      title: "Old Title",
      answers: [],
      feedback: "",
      answerType: "TF",
      answer: true,
      comments: [],
      isFlagged: false,
      type: "pspo-I",
    };

    render(
      <ModalEditQuestion
        isOpen={true}
        question={mockQuestion as any}
        setIsOpen={setIsOpenMock}
        setSelectQuestion={setSelectQuestionMock}
      />
    );

    // Verify initial render
    expect(screen.getByDisplayValue("Old Title")).toBeInTheDocument();

    // Change title
    fireEvent.change(screen.getByDisplayValue("Old Title"), {
      target: { value: "New Title" },
    });

    // Submit form
    fireEvent.click(screen.getByTestId("save-button"));

    await waitFor(() => {
        expect(handleUpdateMock).toHaveBeenCalledWith(expect.objectContaining({
            title: "New Title"
        }));
    });

    // Verify toast (this will fail initially until we implement it)
    expect(toast.success).toHaveBeenCalledWith(expect.stringMatching(/successfully/i));
  });
});
