import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactElement } from "react";
import ImportPreviewModal from "./ImportPreviewModal";
import { QuestionDraft } from "../utils/csvImport";

const renderWithQueryClient = (ui: ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

const singleChoiceQuestion: QuestionDraft = {
  title: "Qui est responsable du Product Backlog ?",
  feedback: "Le Product Owner est seul responsable.",
  answerType: "S",
  type: "pspo-I",
  answers: ["Le Scrum Master", "Le Product Owner"],
  answer: 1,
  answerExplanations: ["Incorrect", "Correct"],
  domain: "Rôles et responsabilités",
};

const tfQuestion: QuestionDraft = {
  title: "Le Sprint Backlog est modifiable en cours de Sprint.",
  feedback: "Vrai.",
  answerType: "TF",
  type: "PSM-I",
  answers: [],
  answer: true,
  answerExplanations: ["Vrai : ...", "Faux : ..."],
};

describe("ImportPreviewModal", () => {
  it("renders one item per question with title, badges and answers", () => {
    renderWithQueryClient(
      <ImportPreviewModal
        isOpen
        questions={[singleChoiceQuestion, tfQuestion]}
        onRemove={vi.fn()}
        onConfirm={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(
      screen.getByText("Qui est responsable du Product Backlog ?")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Le Sprint Backlog est modifiable en cours de Sprint.")
    ).toBeInTheDocument();
    expect(screen.getByText("PSPO-I")).toBeInTheDocument();
    expect(screen.getByText("Rôles et responsabilités")).toBeInTheDocument();
  });

  it("highlights the correct answer for a single-choice question", () => {
    renderWithQueryClient(
      <ImportPreviewModal
        isOpen
        questions={[singleChoiceQuestion]}
        onRemove={vi.fn()}
        onConfirm={vi.fn()}
        onClose={vi.fn()}
      />
    );

    const correctOption = screen.getByText("Le Product Owner").closest("li");
    const wrongOption = screen.getByText("Le Scrum Master").closest("li");
    expect(correctOption).toHaveClass("bg-success");
    expect(correctOption).toHaveTextContent("Correct");
    expect(wrongOption).not.toHaveClass("bg-success");
    expect(wrongOption).toHaveTextContent("Incorrect");
  });

  it("renders True/False questions without an answers list, using Vrai/Faux", () => {
    renderWithQueryClient(
      <ImportPreviewModal
        isOpen
        questions={[tfQuestion]}
        onRemove={vi.fn()}
        onConfirm={vi.fn()}
        onClose={vi.fn()}
      />
    );

    const vrai = screen.getByText("Vrai").closest("li");
    const faux = screen.getByText("Faux").closest("li");
    expect(vrai).toHaveClass("bg-success");
    expect(vrai).toHaveTextContent("Vrai : ...");
    expect(faux).not.toHaveClass("bg-success");
    expect(faux).toHaveTextContent("Faux : ...");
  });

  it("calls onRemove with the row index when its trash icon is clicked", () => {
    const onRemove = vi.fn();
    renderWithQueryClient(
      <ImportPreviewModal
        isOpen
        questions={[singleChoiceQuestion, tfQuestion]}
        onRemove={onRemove}
        onConfirm={vi.fn()}
        onClose={vi.fn()}
      />
    );

    fireEvent.click(
      screen.getByLabelText("Retirer la question 1 de l'import")
    );
    expect(onRemove).toHaveBeenCalledWith(0);
  });

  it("shows a message and disables confirm when the batch is empty", () => {
    renderWithQueryClient(
      <ImportPreviewModal
        isOpen
        questions={[]}
        onRemove={vi.fn()}
        onConfirm={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(
      screen.getByText(/Plus aucune question à importer/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Importer 0 question/).closest("button")).toBeDisabled();
  });

  it("calls onConfirm when the import button is clicked", () => {
    const onConfirm = vi.fn();
    renderWithQueryClient(
      <ImportPreviewModal
        isOpen
        questions={[singleChoiceQuestion]}
        onRemove={vi.fn()}
        onConfirm={onConfirm}
        onClose={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText(/Importer 1 question/));
    expect(onConfirm).toHaveBeenCalled();
  });
});
