import { Question } from "../../utils/types";

export interface ModalEditQuestionProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  question?: Question;
  setSelectQuestion?: (question: Question) => void;
}
