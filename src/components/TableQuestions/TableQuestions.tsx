import "./style.scss";
import "./style-mobile.scss";

import React, { FC, useMemo, useState } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QuestionsContext } from "../../utils/context";
import Table from "../Table/Table";
import { TableQuestionsProps } from "./TableQuestions.types";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const getFormatAnswwerType = (answerType: string) => {
  switch (answerType) {
    case "TF":
      return "True/False";
    case "S":
      return "Single choice";
    case "M":
      return "Multiple choice";
    default:
      return "Unknown";
  }
};

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
  },
  {
    header: "Answer type",
    accessorKey: "answerType",
    width: 150,
    cell: (info: any) => (
      <span className="tag">{getFormatAnswwerType(info.getValue())}</span>
    ),
  },
  {
    header: "Feedback",
    accessorKey: "feedback",
    width: 80,
    cell: (info: any) => (
      <FontAwesomeIcon
        color={info?.getValue() ? "#9fdf6c" : "#e41937"}
        icon={info?.getValue() ? faCheckCircle : faTimesCircle}
      />
    ),
  },
  {
    header: "Last modified",
    accessorKey: "lastModified",
    width: 200,
    cell: (info: any) => <div>{info.getValue()}</div>,
  },
  {
    header: "",
    id: "actions",
    width: 50,
    cell: () => <FontAwesomeIcon icon={faEdit} color={"#5236ab"} />,
  },
];

const TableQuestions: FC<TableQuestionsProps> = () => {
  const { allQuestions } = React.useContext(QuestionsContext);
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

  const table = useReactTable({
    data: allQuestions,
    columns,
    state: {
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      size: 100, //starting column size
      minSize: 50, //enforced during column resizing
      maxSize: 500, //enforced during column resizing
    },
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <div className="TableQuestions">
      <Table data={table} columns={columns} />
    </div>
  );
};

export default TableQuestions;
