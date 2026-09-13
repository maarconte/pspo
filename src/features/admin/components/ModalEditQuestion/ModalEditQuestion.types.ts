import { Question } from "../../../../utils/types";

export interface ModalEditQuestionProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  question?: Question;
  setSelectQuestion?: (question: Question | undefined) => void;
  /** Pre-selects the "Module" field when adding a new question (ignored when editing). */
  defaultType?: string;
}
