import "./style.scss";
import "./style-mobile.scss";

import { FC, useMemo, useState } from "react";
import { useDeleteDoc } from "../../../../utils/hooks";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";
import { useQuestionColumns } from "./hooks/useQuestionColumns";
import { fuzzyFilter } from "./utils/tableUtils";
import { 
  ColumnFiltersState, 
  SortingState, 
  getCoreRowModel, 
  getFilteredRowModel, 
  getPaginationRowModel, 
  getSortedRowModel, 
  useReactTable 
} from "@tanstack/react-table";
import { Question } from "../../../../utils/types";
import { toast } from "react-toastify";

import TableActions from "../../../../ui/Table/TableActions/TableActions";
import TableSearch from "../../../../ui/Table/TableSearch";
import Table from "../../../../ui/Table/Table";
import Modal from "../../../../ui/Modal/Modal";
import ModalEditQuestion from "../ModalEditQuestion/ModalEditQuestion";

const TableQuestions: FC = () => {
  // --- States ---
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 });
  
  const [selectedQuestion, setSelectedQuestion] = useState<Question | undefined>();
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // --- Store & Hooks ---
  const allQuestions = useQuestionsStore((state) => state.allQuestions);
  const { handleDelete } = useDeleteDoc("questions");

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

  // --- Table Config ---
  const columns = useQuestionColumns({
    onSelect: handleSelectQuestion,
    onDeleteRequest: handleDeleteRequest,
    selection: {
      selected: selectedQuestions,
      onToggle: handleToggleSelection,
    }
  });

  const table = useReactTable({
    data: allQuestions,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { pagination, sorting, columnFilters, globalFilter },
    globalFilterFn: fuzzyFilter,
    onColumnFiltersChange: setColumnFilters,
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
            <TableActions
              selectedQuestions={selectedQuestions}
              setSelectedQuestions={setSelectedQuestions}
              setSelectedQuestion={setSelectedQuestion}
              selectedQuestion={selectedQuestion}
            />
            <TableSearch
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
            />
          </div>
        )}
      />

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
