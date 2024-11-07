import "./style.scss";
import "./style-mobile.scss";

import React, { FC, useMemo, useState } from "react";
import {
  SortingFn,
  SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  sortingFns,
  useReactTable,
} from "@tanstack/react-table";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import ModalEditQuestion from "../ModalEditQuestion";
import { Question } from "../../utils/types";
import { QuestionsContext } from "../../utils/context";
import Table from "../Table/Table";
import { TableQuestionsProps } from "./TableQuestions.types";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faCircleDot } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { formatTimestamp } from "../../utils/hooks";

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
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question>();
  const { allQuestions } = React.useContext(QuestionsContext);

  const columns = [
    {
      header: "",
      id: "id",
      width: 50,
      cell: ({ row }: any) => row.index + 1,
    },
    {
      header: "Title",
      accessorKey: "title",
      width: 200,
      cell: (info: any) => <div className="ellipsis">{info.getValue()}</div>,
      enableSorting: true,
      sorting: sortingFns.text,
    },
    {
      header: "Answer type",
      accessorKey: "answerType",
      width: 150,
      cell: (info: any) => getFormatAnswwerType(info.getValue()),
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
    },
    {
      header: "",
      id: "actions",
      width: 50,
      cell: (info: any) => (
        <FontAwesomeIcon
          icon={faEdit}
          color={"#5236ab"}
          onClick={() => handleSelectQuestion(info.row.original)}
        />
      ),
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
    pageSize: 25,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data: allQuestions,
    columns,
    state: {
      pagination,
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
        />
      )}
    </div>
  );
};

export default TableQuestions;
