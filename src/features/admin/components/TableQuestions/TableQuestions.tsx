import "./style.scss";
import "./style-mobile.scss";

import { Button_Style, Button_Type } from "../../../../ui/Button/Button.types";
import {
  ColumnFiltersState,
  FilterFn,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  sortingFns,
  useReactTable,
} from "@tanstack/react-table";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { FC, useEffect, useMemo, useState } from "react";
import { Trash2, XCircle, CheckSquare, X, Edit, ToggleRight, Circle } from "lucide-react";
import { formatTimestamp, useDeleteDoc } from "../../../../utils/hooks";

import Button from "../../../../ui/Button/Button";
import Modal from "../../../../ui/Modal/Modal";
import ModalEditQuestion from "../ModalEditQuestion/ModalEditQuestion";
import { Question } from "../../../../utils/types";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";
import Table from "../../../../ui/Table/Table";
import { TableQuestionsProps } from "./TableQuestions.types";

declare module "@tanstack/react-table" {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter = (row: any, columnId: any, value: any, addMeta: any) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

const getFormatAnswwerType = (answerType: string) => {
  const answerTypeOptions = [
    { value: "TF", label: "True/False", Icon: ToggleRight },
    { value: "S", label: "Single choice", Icon: Circle },
    { value: "M", label: "Multiple choice", Icon: CheckSquare },
  ];
  const selectedOption = answerTypeOptions.find(
    (option) => option.value === answerType
  );
  const IconComponent = selectedOption?.Icon;
  return (
    <div className="d-flex align-items-center gap-05">
      {IconComponent && (
        <span className="tag">
          <IconComponent size={16} color="#8b78c7" />
        </span>
      )}
      <span>{selectedOption?.label}</span>
    </div>
  );
};

const TableQuestions: FC<TableQuestionsProps> = () => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question>();
  const allQuestions = useQuestionsStore((state) => state.allQuestions);
  const refetch = useQuestionsStore((state) => state.refetch);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isSelectNone, setIsSelectNone] = useState(false);
  const { handleDelete } = useDeleteDoc("questions");

  const columns = [
    {
      // column for the checkbox to multiselect
      header: "",
      accessorKey: "id",
      id: "selection",
      cell: ({ row }: any) => (
        <div className="checkbox-container">
          <input
            type="checkbox"
            name="select-question"
            id={`select-question-${row.index}`}
            onChange={() => {
              if (selectedQuestions.includes(row.original)) {
                setSelectedQuestions(
                  selectedQuestions.filter(
                    (question) => question !== row.original
                  )
                );
                setIsSelectAll(false);
                setIsSelectNone(false);
              } else {
                setSelectedQuestions([...selectedQuestions, row.original]);
                setIsSelectAll(false);
                setIsSelectNone(false);
              }
            }}
            checked={selectedQuestions.includes(row.original)}
          />
          <label htmlFor={`select-question-${row.index}`} />
        </div>
      ),
      enableSorting: false,
      enableColumnFilter: false,
      size: 42,
      width: 42,
    },
    {
      header: "",
      id: "id",
      width: 42,
      cell: ({ row }: any) => (
        <span
          className="pointer"
          onClick={() => handleSelectQuestion(row.original)}
        >
          {row.index + 1}
        </span>
      ),
      enableColumnFilter: false,
    },
    {
      header: "Title",
      accessorKey: "title",
      width: 200,
      cell: (info: any) => (
        <div
          className="ellipsis pointer"
          onClick={() => handleSelectQuestion(info.row.original)}
        >
          {info.getValue()}
        </div>
      ),
      enableSorting: true,
      sorting: sortingFns.text,
      enableColumnFilter: true,
    },
    {
      header: "Formation",
      accessorKey: "type",
      enableColumnFilter: false,
      enableSorting: true,
      width: 150,
    },
    {
      header: "Answer type",
      accessorKey: "answerType",
      width: 150,
      cell: (info: any) => getFormatAnswwerType(info.getValue()),
      enableColumnFilter: false,
    },
    {
      header: "Reported",
      accessorKey: "isFlagged",
      width: 80,
      cell: (info: any) => {
        if (info.getValue())
          return (
            <div className="text-center">
              <XCircle size={24} color="#e41937" />
            </div>
          );
      },
      enableColumnFilter: false,
    },
    {
      header: "Feedback",
      accessorKey: "feedback",
      width: 80,
      cell: (info: any) => {
        if (!info?.getValue())
          return (
            <div className="text-center">
              <XCircle size={24} color="#e41937" />
            </div>
          );
      },
      enableColumnFilter: false,
    },
    {
      header: "Last modified",
      accessorKey: "updatedAt",
      width: 200,
      cell: (info: any) => {
        return (
          <div className="text-center">
            {info.getValue() && formatTimestamp(info.getValue(), "fr-FR")}
          </div>
        );
      },
      enableColumnFilter: false,
    },
    {
      header: "Created at",
      accessorKey: "createdAt",
      width: 200,
      cell: (info: any) => {
        return (
          <div className="text-center">
            {info.getValue() && formatTimestamp(info.getValue(), "fr-FR")}
          </div>
        );
      },
      enableColumnFilter: false,
    },
    {
      header: "",
      id: "actions",
width: 100,
      cell: (info: any) => (
        <div className="d-flex gap-05 actions">
          <Edit
            size={42}
            className="pointer action"
            color="#8b78c7"
            onClick={() => handleSelectQuestion(info.row.original)}
          />

          <Trash2
            size={42}
            className="pointer action"
            color="#8b78c7"
            onClick={() => {
              setSelectedQuestion(info.row.original);
              setIsDeleteModalOpen(true);
            }}
          />
        </div>
      ),
      enableColumnFilter: false,
    },
  ];

  // select question
  const handleSelectQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  // Pagination
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  // Table

  const table = useReactTable({
    data: allQuestions,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      pagination,
      sorting,
      columnFilters,
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "fuzzy",
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  });

  const handleDeleteAll = () => {
    selectedQuestions.forEach((question: Question) => {
      handleDelete(question.id);
    });
    setSelectedQuestions([]);
    setIsSelectAll(false);
    setIsSelectNone(false);
    refetch();
  };

  return (
    <div className="TableQuestions">
      <Table
        data={table}
        columns={columns}
        selectedQuestion={selectedQuestion}
        selectedQuestions={selectedQuestions}
        setSelectedQuestion={setSelectedQuestion}
        setSelectedQuestions={setSelectedQuestions}
        setIsSelectAll={setIsSelectAll}
        setIsSelectNone={setIsSelectNone}
      />
      {selectedQuestion && (
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
          title={`${selectedQuestion ? "Delete question" : "Delete questions"}`}
          onConfirm={() => {
            if (selectedQuestion) {
              handleDelete(selectedQuestion.id);
              selectedQuestion && setSelectedQuestion(undefined);
            } else {
              handleDeleteAll();
              setSelectedQuestions([]);
              setIsSelectAll(false);
              setIsSelectNone(false);
            }
            setIsDeleteModalOpen(false);
            refetch();
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

export default TableQuestions;
