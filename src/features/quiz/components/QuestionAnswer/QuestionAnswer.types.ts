export type AnswerStatus = "default" | "selected" | "success" | "error" | "missed";

export interface QuestionAnswerProps {
  id: string;
  name: string;
  type: "radio" | "checkbox";
  label: string;
  checked: boolean;
  onChange: () => void;
  isReadOnly?: boolean;
  status?: AnswerStatus;
  /** Per-option feedback (HTML). When set, an info icon toggles it under the option. */
  explanation?: string;
}
