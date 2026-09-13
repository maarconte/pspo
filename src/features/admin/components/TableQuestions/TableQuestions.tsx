import "./style.scss";
import "./style-mobile.scss";

import { FC, useMemo, useState } from "react";
import { Copy } from "lucide-react";
import { useDeleteDoc } from "../../../../utils/hooks";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";
import { useModules } from "../../hooks/useModules";
import { getFormationValue } from "../../../../utils/helpers/formationLabel";
import { useQuestionColumns } from "./hooks/useQuestionColumns";
import { fuzzyFilter } from "./utils/tableUtils";
import { findDuplicateQuestions } from "./utils/duplicateDetection";
import {
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { Question } from "../../../../utils/types";
import { QUESTIONS_COLLECTION } from "../../../../utils/constants";
import { toast } from "react-toastify";

import Button from "../../../../ui/Button/Button";
import { Button_Style } from "../../../../ui/Button/Button.types";
import Select from "../../../../ui/Select/Select";
import TableActions from "../../../../ui/Table/TableActions/TableActions";
import TableSearch from "../../../../ui/Table/TableSearch";
import Table from "../../../../ui/Table/Table";
import Modal from "../../../../ui/Modal/Modal";
import ModalEditQuestion from "../ModalEditQuestion/ModalEditQuestion";
import DuplicateQuestionsModal from "./DuplicateQuestionsModal/DuplicateQuestionsModal";

const TableQuestions: FC = () => {
  // --- States ---
  const [globalFilter, setGlobalFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 });
  
  const [selectedQuestion, setSelectedQuestion] = useState<Question | undefined>();
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDuplicatesModalOpen, setIsDuplicatesModalOpen] = useState(false);

  // --- Store & Hooks ---
  const allQuestions = useQuestionsStore((state) => state.allQuestions);
  const { handleDelete, isLoading: isDeletingDuplicate } = useDeleteDoc(QUESTIONS_COLLECTION);
  const { modules } = useModules();
  const duplicateGroups = useMemo(
    () => findDuplicateQuestions(allQuestions),
    [allQuestions]
  );

  const moduleFilterOptions = useMemo(
    () => [
      { label: "Tous les modules", value: "" },
      ...modules.map((module) => ({
        label: `${module.title}${!module.isActive ? " (désactivé)" : ""}`,
        value: getFormationValue(module.title),
      })),
    ],
    [modules]
  );

  const filteredQuestions = useMemo(
    () =>
      moduleFilter
        ? allQuestions.filter((question) => question.type === moduleFilter)
        : allQuestions,
    [allQuestions, moduleFilter]
  );

  // --- Handlers ---
  const handleSelectQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (question: Question) => {
    setSelectedQuestion(question);
    setIsDeleteModalOpen(true);
  };

  const handleToggleSelection = (question: Question) => {
    const isSelected = selectedQuestions.some(q => q.id === question.id);
    if (isSelected) {
      setSelectedQuestions(prev => prev.filter(q => q.id !== question.id));
    } else {
      setSelectedQuestions(prev => [...prev, question]);
    }
  };

  const onDeleteConfirm = async () => {
    try {
      if (selectedQuestion) {
        await handleDelete(selectedQuestion.id);
        toast.success("Question deleted successfully");
      } else {
        for (const question of selectedQuestions) {
          await handleDelete(question.id);
        }
        setSelectedQuestions([]);
        toast.success("Questions deleted successfully");
      }
    } catch (error) {
      console.error("Deletion failed:", error);
      toast.error("Failed to delete question(s)");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedQuestion(undefined);
    }
  };

  const handleDeleteDuplicate = async (questionId: string) => {
    try {
      await handleDelete(questionId);
      toast.success("Question deleted successfully");
    } catch (error) {
      console.error("Deletion failed:", error);
      toast.error("Failed to delete question");
    }
  };

  // --- Table Config ---
  const columns = useMemo(() => useQuestionColumns({
    onSelect: handleSelectQuestion,
    onDeleteRequest: handleDeleteRequest,
    selection: {
      selected: selectedQuestions,
      onToggle: handleToggleSelection,
    }
  }), [selectedQuestions]);

  const table = useReactTable({
    data: filteredQuestions,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { pagination, sorting, globalFilter },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="TableQuestions">
      <Table
        data={table}
        selectedItem={selectedQuestion}
        selectedItems={selectedQuestions}
        setSelectedItem={setSelectedQuestion}
        setSelectedItems={setSelectedQuestions}
        renderHeaderAddon={(tableInstance) => (
          <div className="d-flex gap-1 w-100 justify-content-between">
            <div className="d-flex gap-05">
              <TableActions
                selectedQuestions={selectedQuestions}
                setSelectedQuestions={setSelectedQuestions}
                setSelectedQuestion={setSelectedQuestion}
                selectedQuestion={selectedQuestion}
              />
              {duplicateGroups.length > 0 && (
                <Button
                  label={`Doublons (${duplicateGroups.length})`}
                  style={Button_Style.OUTLINED}
                  onClick={() => setIsDuplicatesModalOpen(true)}
                  icon={<Copy size={16} />}
                />
              )}
            </div>
            <div className="d-flex gap-05">
              <Select
                name="moduleFilter"
                id="moduleFilter"
                options={moduleFilterOptions}
                value={moduleFilter}
                placeholder="Tous les modules"
                handleChange={(value) => setModuleFilter(String(value))}
              />
              <TableSearch
                value={globalFilter ?? ""}
                onChange={(value) => setGlobalFilter(String(value))}
              />
            </div>
          </div>
        )}
      />

      {isDuplicatesModalOpen && (
        <DuplicateQuestionsModal
          isOpen={isDuplicatesModalOpen}
          groups={duplicateGroups}
          isDeleting={isDeletingDuplicate}
          onDelete={handleDeleteDuplicate}
          onClose={() => setIsDuplicatesModalOpen(false)}
        />
      )}

      {isModalOpen && (
        <ModalEditQuestion
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          question={selectedQuestion}
          setSelectQuestion={setSelectedQuestion}
        />
      )}

      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          setIsClosed={setIsDeleteModalOpen}
          title={selectedQuestion ? "Delete question" : "Delete questions"}
          labelOnConfirm="Delete"
          onConfirm={onDeleteConfirm}
          onClose={() => setIsDeleteModalOpen(false)}
          type="error"
        >
          <p>
            {selectedQuestion 
              ? "Are you sure you want to delete this question?" 
              : `Are you sure you want to delete ${selectedQuestions.length} questions?`}
          </p>
        </Modal>
      )}
    </div>
  );
};

export default TableQuestions;
