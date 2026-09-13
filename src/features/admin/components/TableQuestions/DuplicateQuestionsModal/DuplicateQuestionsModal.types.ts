import { DuplicateQuestionGroup } from "../utils/duplicateDetection";

export interface DuplicateQuestionsModalProps {
  isOpen: boolean;
  groups: DuplicateQuestionGroup[];
  isDeleting?: boolean;
  onDelete: (questionId: string) => void | Promise<void>;
  onClose: () => void;
}
