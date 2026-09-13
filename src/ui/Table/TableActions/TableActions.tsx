import React, { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { useDeleteDoc } from "../../../utils/hooks";

import Button from "../../Button";
import { Button_Type } from "../../Button/Button.types";
import FileUploader from "../../FileUploader";
import ImportPreviewModal from "./ImportPreviewModal/ImportPreviewModal";
import Modal from "../../Modal";
import ModalEditQuestion from "../../../features/admin/components/ModalEditQuestion/ModalEditQuestion";
import { Question } from "../../../utils/types";
import { QUESTIONS_COLLECTION } from "../../../utils/constants";
import { toast } from "react-toastify";
import { useCsvQuestionImport } from "./utils/useCsvQuestionImport";

interface TableActionsProps {
  selectedQuestions: Question[];
  selectedQuestion?: Question;
  setSelectedQuestions?: React.Dispatch<React.SetStateAction<Question[]>>;
  setSelectedQuestion?: React.Dispatch<
    React.SetStateAction<Question | undefined>
  >;
  setIsSelectAll?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSelectNone?: React.Dispatch<React.SetStateAction<boolean>>;
  /** Raw module value ("" = all modules) driven by the table's module filter; imported questions are stamped with it. */
  importModuleType: string;
}
const TableActions: React.FC<TableActionsProps> = ({
  selectedQuestions,
  selectedQuestion,
  setSelectedQuestions,
  setSelectedQuestion,
  setIsSelectAll,
  setIsSelectNone,
  importModuleType,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { handleDelete } = useDeleteDoc(QUESTIONS_COLLECTION);
  const csvImport = useCsvQuestionImport();

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

  return (
    <div className="d-flex gap-05 justify-content-end mb-1">
      <FileUploader
        handleFile={(file: File) => csvImport.parseFile(file, importModuleType)}
        disabled={!importModuleType}
        title={
          !importModuleType
            ? "Choisis un module dans le filtre pour importer des questions"
            : undefined
        }
      />
      {csvImport.csvData.length > 0 && (
        <Button
          label={`Prévisualiser ${csvImport.csvData.length} question(s)`}
          onClick={csvImport.openPreview}
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

      {csvImport.isPreviewOpen && (
        <ImportPreviewModal
          isOpen={csvImport.isPreviewOpen}
          questions={csvImport.csvData}
          isImporting={csvImport.isImporting}
          onRemove={csvImport.removeFromPreview}
          onConfirm={csvImport.confirmImport}
          onClose={csvImport.closePreview}
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
