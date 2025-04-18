import "./style.scss";
import "./style-mobile.scss";

import { Button_Style, Button_Type } from "../Button/Button.types";
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
import React, { FC, useEffect, useMemo, useState } from "react";
import { faCircleDot, faTrash } from "@fortawesome/free-solid-svg-icons";
import { formatTimestamp, useDeleteDoc } from "../../utils/hooks";

import Button from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import Modal from "../Modal";
import ModalEditQuestion from "../ModalEditQuestion";
import { Question } from "../../utils/types";
import { QuestionsContext } from "../../utils/context";
import Table from "../Table/Table";
import { TableQuestionsProps } from "./TableQuestions.types";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { faToggleOn } from "@fortawesome/free-solid-svg-icons";

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
    { value: "TF", label: "True/False", icon: faToggleOn as IconProp },
    { value: "S", label: "Single choice", icon: faCircleDot as IconProp },
    { value: "M", label: "Multiple choice", icon: faSquareCheck as IconProp },
  ];
  const selectedOption = answerTypeOptions.find(
    (option) => option.value === answerType
  );
  return (
    <div className="d-flex align-items-center gap-05">
      {selectedOption?.icon && (
        <span className="tag">
          <FontAwesomeIcon icon={selectedOption?.icon} color="#8b78c7" />
        </span>
      )}
      <span>{selectedOption?.label}</span>
    </div>
  );
};

const TableQuestions: FC<TableQuestionsProps> = () => {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question>();
  const { allQuestions, refetch } = React.useContext(QuestionsContext);
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
        <div className="d-flex justify-content-center">
          <input
            type="checkbox"
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
              <FontAwesomeIcon color={"#e41937"} icon={faTimesCircle} />
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
              <FontAwesomeIcon color={"#e41937"} icon={faTimesCircle} />
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
      width: 50,
      cell: (info: any) => (
        <div className="d-flex gap-05 actions">
          <FontAwesomeIcon
            className="pointer action"
            icon={faEdit}
            color={"#8b78c7"}
            onClick={() => handleSelectQuestion(info.row.original)}
          />
          <FontAwesomeIcon
            className="pointer action"
            icon={faTrash}
            color={"#8b78c7"}
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
      {selectedQuestions.length > 0 && (
        <Button
          onClick={() => setIsDeleteModalOpen(true)}
          label="Delete"
          type={Button_Type.ERROR}
          className="mb-1"
        />
      )}
      <Table data={table} columns={columns} />
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
