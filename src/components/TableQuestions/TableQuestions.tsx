import "./style.scss";
import "./style-mobile.scss";

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
import React, { FC, useMemo, useState } from "react";
import { faCircleDot, faTrash } from "@fortawesome/free-solid-svg-icons";
import { formatTimestamp, useDeleteDoc } from "../../utils/hooks";

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

  const { handleDelete } = useDeleteDoc("questions");

  const columns = [
    {
      header: "",
      id: "id",
      width: 50,
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
            onClick={() => handleDeleteQuestion(info.row.original)}
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

  // select question to delete
  const handleDeleteQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setIsDeleteModalOpen(true);
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
  return (
    <div className="TableQuestions">
      <Table data={table} columns={columns} />
      {selectedQuestion && (
        <ModalEditQuestion
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          question={selectedQuestion}
          setSelectQuestion={setSelectedQuestion}
        />
      )}
      {selectedQuestion && isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          setIsClosed={setIsDeleteModalOpen}
          title="Delete question"
          onConfirm={() => {
            handleDelete(selectedQuestion.id);
            selectedQuestion && setSelectedQuestion(undefined);
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
