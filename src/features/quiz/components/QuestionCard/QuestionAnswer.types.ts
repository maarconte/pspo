export type AnswerStatus = "default" | "selected" | "success" | "error";

export interface QuestionAnswerProps {
  id: string;
  name: string;
  type: "radio" | "checkbox";
  label: string;
  checked: boolean;
  onChange: () => void;
  isReadOnly?: boolean;
  status?: AnswerStatus;
}
