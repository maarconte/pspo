import React, { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { useAddDoc, useDeleteDoc } from "../../../utils/hooks";

import Button from "../../Button";
import { Button_Type } from "../../Button/Button.types";
import FileUploader from "../../FileUploader";
import Modal from "../../Modal";
import ModalEditQuestion from "../../../features/admin/components/ModalEditQuestion/ModalEditQuestion";
import Papa, { ParseResult } from "papaparse";
import { Question } from "../../../utils/types";
import { QUESTIONS_COLLECTION } from "../../../utils/constants";
import { toast } from "react-toastify";
import {
  CsvQuestionRow,
  QuestionDraft,
  parseCsvRow,
} from "./utils/csvImport";

interface TableActionsProps {
  selectedQuestions: Question[];
  selectedQuestion?: Question;
  setSelectedQuestions?: React.Dispatch<React.SetStateAction<Question[]>>;
  setSelectedQuestion?: React.Dispatch<
    React.SetStateAction<Question | undefined>
  >;
  setIsSelectAll?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSelectNone?: React.Dispatch<React.SetStateAction<boolean>>;
}
const TableActions: React.FC<TableActionsProps> = ({
  selectedQuestions,
  selectedQuestion,
  setSelectedQuestions,
  setSelectedQuestion,
  setIsSelectAll,
  setIsSelectNone,
}) => {
  const [csvData, setCsvData] = useState<QuestionDraft[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { handleAdd } = useAddDoc(QUESTIONS_COLLECTION);
  const { handleDelete } = useDeleteDoc(QUESTIONS_COLLECTION);
  const handleDeleteAll = async () => {
    if (!selectedQuestions || selectedQuestions.length === 0) return;
    if (!setSelectedQuestions || !setIsSelectAll || !setIsSelectNone) return;

    for (const question of selectedQuestions) {
      await handleDelete(question.id);
    }
    setSelectedQuestions([]);
    setIsSelectAll(false);
    setIsSelectNone(false);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Without an explicit `newline`, Papa Parse's auto-detection can
    // misparse a quoted field sitting right at end-of-file (observed:
    // "Quoted field unterminated" on an otherwise well-formed file whose
    // last row's last field — correctAnswer — was quoted). Detect the
    // file's actual convention ourselves instead of hardcoding one, since
    // forcing "\n" on a \r\n file leaks a stray \r into the last column's
    // name (e.g. "correctAnswer\r"), silently dropping every row.
    const text = await file.text();
    const newline = text.includes("\r\n") ? "\r\n" : "\n";

    Papa.parse<CsvQuestionRow>(text, {
      header: true,
      skipEmptyLines: true,
      newline,
      complete: (result: ParseResult<CsvQuestionRow>) => {
        const errors: string[] = [];
        const questions: QuestionDraft[] = [];

        result.data.forEach((row, index) => {
          const parsed = parseCsvRow(row, index + 2); // +1 header, +1 1-based
          if ("error" in parsed) {
            errors.push(parsed.error);
          } else {
            questions.push(parsed.question);
          }
        });

        if (errors.length > 0) {
          console.warn("Erreurs d'import CSV :", errors);
          toast.error(
            `${errors.length} ligne(s) ignorée(s) : ${errors
              .slice(0, 3)
              .join(" | ")}${errors.length > 3 ? "…" : ""}`
          );
        }

        setCsvData(questions);
      },
      error: (error: Error) => {
        console.error("Error parsing CSV file:", error);
        toast.error("Impossible de lire le fichier CSV");
      },
    });
  };

  const addAllQuestions = async () => {
    if (!csvData) return;
    try {
      for (const question of csvData) {
        await handleAdd(question);
      }
      setCsvData([]);
      toast.success("The questions have been added");
    } catch (error) {
      toast.error(
        "An error occurred while adding the questions. Please try again."
      );
    }
  };
  return (
    <div className="d-flex gap-05 justify-content-end mb-1">
      <FileUploader handleFile={handleFileUpload} />
      {csvData.length > 0 && (
        <Button
          label={`Add ${csvData.length} questions`}
          onClick={addAllQuestions}
          icon={<Plus size={16} />}
        />
      )}
      <Button
        onClick={() => setIsAddModalOpen(true)}
        label="Add a question"
        icon={<Plus size={16} />}
      />

      {selectedQuestions.length > 0 && (
        <Button
          onClick={() => setIsDeleteModalOpen(true)}
          label="Delete"
          type={Button_Type.ERROR}
          icon={<Trash2 size={16} />}
        />
      )}

      {isAddModalOpen && (
        <ModalEditQuestion
          isOpen={isAddModalOpen}
          setIsOpen={setIsAddModalOpen}
        />
      )}

      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          setIsClosed={setIsDeleteModalOpen}
          title="Delete question(s)"
          onConfirm={async () => {
            if (
              !setSelectedQuestions ||
              !setIsSelectAll ||
              !setIsSelectNone ||
              !setSelectedQuestion
            )
              return;

            try {
              if (selectedQuestion) {
                await handleDelete(selectedQuestion.id);
                selectedQuestion && setSelectedQuestion(undefined);
                toast.success("Question deleted successfully");
              } else {
                await handleDeleteAll();
                setSelectedQuestions([]);
                setIsSelectAll(false);
                setIsSelectNone(false);
                toast.success("Questions deleted successfully");
              }
            } catch (error) {
              toast.error("Failed to delete question(s)");
            } finally {
              setIsDeleteModalOpen(false);
            }
          }}
          labelOnConfirm="Delete"
          onClose={() => setIsDeleteModalOpen(false)}
          type="error"
        >
          <div>
            <p>Are you sure you want to delete this question?</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TableActions;
