import { ColumnDef } from "@tanstack/react-table";
import { QuizSessionStat, QuestionStat } from "../../../../../utils/types";
import { Trash2 } from "lucide-react";
import React from "react";
import Button from "../../../../../ui/Button";
import { Button_Style, Button_Type } from "../../../../../ui/Button/Button.types";

interface ExtendedSessionStat extends QuizSessionStat {
  absoluteIndex: number;
}

interface UseSessionColumnsProps {
  onDeleteRequest: (sessionId: string) => void;
  totalCount: number;
}

export const useSessionColumns = ({
  onDeleteRequest,
  totalCount,
}: UseSessionColumnsProps): ColumnDef<ExtendedSessionStat>[] => {
  return [
    {
      id: "sessionNumber",
      header: "Session",
      accessorKey: "absoluteIndex",
      cell: ({ getValue }) => (
        <span className="fw-bold text-primary">Session #{totalCount - getValue<number>()}</span>
      ),
    },
    {
      id: "date",
      header: "Date",
      accessorKey: "timestamp",
      cell: ({ getValue }) => {
        const date = new Date(getValue<number>());
        const formattedDate = date.toLocaleDateString("en-FR", {
          day: "2-digit",
          month: "short",
        });
        const formattedTime = date.toLocaleTimeString("en-FR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        return <span className="text-muted">{formattedDate} - {formattedTime}</span>;
      },
    },
    {
      header: "Module",
      accessorKey: "formation",
      cell: ({ getValue }) => (
        <span className="badge bg-light text-primary border">{getValue<string>()}</span>
      ),
    },
    {
      header: "Score",
      accessorKey: "score",
      sortingFn: (rowA, rowB) => {
        const getPercent = (row: any) => {
          const session = row.original;
          const answeredCount = session.details?.filter((d: QuestionStat) => d.userAnswer !== null).length || 0;
          return answeredCount > 0 ? session.score / answeredCount : 0;
        };
        return getPercent(rowA) - getPercent(rowB);
      },
      cell: ({ row }) => {
        const session = row.original;
        const answeredCount = session.details?.filter((d: QuestionStat) => d.userAnswer !== null).length || 0;
        const successPercent = answeredCount > 0 ? Math.round((session.score / answeredCount) * 100) : 0;
        return (
          <span className={`fw-bold ${successPercent >= 85 ? "text-success" : "text-danger"}`}>
            {successPercent}%
          </span>
        );
      },
    },
    {
      header: "Questions",
      id: "questions",
      cell: ({ row }) => {
        const answeredCount = row.original.details?.filter((d: QuestionStat) => d.userAnswer !== null).length || 0;
        return <span className="text-muted">{answeredCount} / 80</span>;
      },
    },
    {
      header: "Total time",
      accessorKey: "totalTimeMs",
      cell: ({ getValue }) => {
        const totalMin = (getValue<number>() / 60000).toFixed(1);
        return <span className="text-muted">{totalMin}min</span>;
      },
    },
    {
      header: "Time per question",
      accessorKey: "averageTimeMs",
      cell: ({ getValue }) => {
        const avgMin = (getValue<number>() / 60000).toFixed(2);
        return <span className="text-muted">{avgMin}min</span>;
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="text-end pe-4">
          <Button
            onClick={() => onDeleteRequest(row.original.id || "")}
            title="Delete Session"
            isIconButton
            style={Button_Style.TONAL}
            type={Button_Type.ERROR}
            size="sm"
            icon={<Trash2 size={18} />}
          />
        </div>
      ),
    },
  ];
};
