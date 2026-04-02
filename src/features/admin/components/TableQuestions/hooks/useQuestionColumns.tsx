import { ColumnDef, sortingFns } from "@tanstack/react-table";
import { Question } from "../../../../../utils/types";
import { Trash2, XCircle, CheckSquare, Edit, ToggleRight, Circle } from "lucide-react";
import { formatTimestamp } from "../../../../../utils/hooks";
import React from "react";

interface AnswerTypeOption {
  value: string;
  label: string;
  Icon: React.FC<{ size: number; color: string }>;
}

const ANSWER_TYPE_OPTIONS: AnswerTypeOption[] = [
  { value: "TF", label: "True/False", Icon: ToggleRight },
  { value: "S", label: "Single choice", Icon: Circle },
  { value: "M", label: "Multiple choice", Icon: CheckSquare },
];

const renderAnswerType = (answerType: string) => {
  const selectedOption = ANSWER_TYPE_OPTIONS.find((option) => option.value === answerType);
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

interface UseQuestionColumnsProps {
  onSelect: (question: Question) => void;
  onDeleteRequest: (question: Question) => void;
  selection: {
    selected: Question[];
    onToggle: (question: Question) => void;
  };
}

export const useQuestionColumns = ({ 
  onSelect, 
  onDeleteRequest,
  selection 
}: UseQuestionColumnsProps): ColumnDef<Question>[] => {
  return [
    {
      id: "selection",
      header: "",
      accessorKey: "id",
      size: 42,
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className="checkbox-container">
          <input
            type="checkbox"
            name={`select-question-${row.index}`}
            id={`select-question-${row.index}`}
            onChange={() => selection.onToggle(row.original)}
            checked={selection.selected.includes(row.original)}
          />
          <label htmlFor={`select-question-${row.index}`} />
        </div>
      ),
    },
    {
      id: "index",
      header: "",
      enableColumnFilter: false,
      cell: ({ row }) => (
        <span className="pointer" onClick={() => onSelect(row.original)}>
          {row.index + 1}
        </span>
      ),
    },
    {
      header: "Title",
      accessorKey: "title",
      size: 200,
      enableSorting: true,
      sortingFn: sortingFns.text,
      enableColumnFilter: true,
      cell: ({ row, getValue }) => (
        <div className="ellipsis pointer" onClick={() => onSelect(row.original)}>
          {getValue<string>()}
        </div>
      ),
    },
    {
      header: "Formation",
      accessorKey: "type",
      size: 150,
      enableSorting: true,
      enableColumnFilter: false,
    },
    {
      header: "Answer type",
      accessorKey: "answerType",
      size: 150,
      enableColumnFilter: false,
      cell: ({ getValue }) => renderAnswerType(getValue<string>()),
    },
    {
      header: "Reported",
      accessorKey: "isFlagged",
      size: 80,
      enableColumnFilter: false,
      cell: ({ getValue }) =>
        getValue() && (
          <div className="text-center">
            <XCircle size={24} color="#e41937" />
          </div>
        ),
    },
    {
      header: "Feedback",
      accessorKey: "feedback",
      size: 80,
      enableColumnFilter: false,
      cell: ({ getValue }) =>
        !getValue() && (
          <div className="text-center">
            <XCircle size={24} color="#e41937" />
          </div>
        ),
    },
    {
      header: "Last modified",
      accessorKey: "updatedAt",
      size: 200,
      enableColumnFilter: false,
      cell: ({ getValue }) => (
        <div className="text-center">
          {(getValue() as any) && formatTimestamp(getValue(), "fr-FR")}
        </div>
      ),
    },
    {
      header: "Created at",
      accessorKey: "createdAt",
      size: 200,
      enableColumnFilter: false,
      cell: ({ getValue }) => (
        <div className="text-center">
          {(getValue() as any) && formatTimestamp(getValue(), "fr-FR")}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      size: 60,
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className="d-flex gap-05 actions">
          <Edit
            size={32}
            className="pointer action"
            color="#8b78c7"
            onClick={() => onSelect(row.original)}
          />
          <Trash2
            size={32}
            className="pointer action"
            color="#8b78c7"
            onClick={() => onDeleteRequest(row.original)}
          />
        </div>
      ),
    },
  ];
};
