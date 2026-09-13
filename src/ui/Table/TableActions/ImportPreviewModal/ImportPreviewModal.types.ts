import { QuestionDraft } from "../utils/csvImport";

export interface ImportPreviewModalProps {
  isOpen: boolean;
  questions: QuestionDraft[];
  isImporting?: boolean;
  onRemove: (index: number) => void;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}
