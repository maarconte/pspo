import { Table as TanStackTable } from "@tanstack/react-table";
import { Question } from "../../utils/types";

export interface TableProps {
  data: TanStackTable<Question>;
  selectedQuestions?: Question[];
  selectedQuestion?: Question;
  setSelectedQuestions?: React.Dispatch<React.SetStateAction<Question[]>>;
  setSelectedQuestion?: React.Dispatch<
    React.SetStateAction<Question | undefined>
  >;
  setIsSelectAll?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSelectNone?: React.Dispatch<React.SetStateAction<boolean>>;
}
