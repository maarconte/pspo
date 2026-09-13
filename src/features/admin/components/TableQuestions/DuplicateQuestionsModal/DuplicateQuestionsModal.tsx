import "./style.scss";

import { FC } from "react";
import { Trash2 } from "lucide-react";

import Button from "../../../../../ui/Button/Button";
import { Button_Style } from "../../../../../ui/Button/Button.types";
import Modal from "../../../../../ui/Modal/Modal";
import { DuplicateQuestionsModalProps } from "./DuplicateQuestionsModal.types";
import { getFormationLabel } from "../../../../../utils/helpers/formationLabel";

const DuplicateQuestionsModal: FC<DuplicateQuestionsModalProps> = ({
  isOpen,
  groups,
  isDeleting,
  onDelete,
  onClose,
}) => (
  <Modal
    isOpen={isOpen}
    setIsClosed={onClose}
    onClose={onClose}
    title={`Questions en doublon (${groups.length} groupe${
      groups.length > 1 ? "s" : ""
    })`}
    hideButtons
  >
    <div className="DuplicateQuestionsModal">
      {groups.length === 0 ? (
        <p className="text-muted">Aucun doublon détecté.</p>
      ) : (
        <p>
          Ces questions ont un intitulé identique une fois les accents, la
          casse et la ponctuation ignorés. Supprime les exemplaires en trop
          avec l'icône corbeille.
        </p>
      )}

      <div className="DuplicateQuestionsModal__list">
        {groups.map((group) => (
          <div
            className="DuplicateQuestionsModal__group"
            key={group.normalizedTitle}
          >
            <div className="DuplicateQuestionsModal__group-header">
              <strong>{group.questions.length} questions identiques</strong>
            </div>
            <ul className="DuplicateQuestionsModal__items">
              {group.questions.map((question) => (
                <li
                  key={question.id}
                  className="DuplicateQuestionsModal__item"
                >
                  <div className="DuplicateQuestionsModal__item-content">
                    <span className="DuplicateQuestionsModal__title">
                      {question.title}
                    </span>
                    <div className="DuplicateQuestionsModal__badges">
                      {question.type && (
                        <span className="badge">{getFormationLabel(question.type)}</span>
                      )}
                      {question.answerType && (
                        <span className="badge">{question.answerType}</span>
                      )}
                      {question.domain && (
                        <span className="badge">{question.domain}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    style={Button_Style.OUTLINED}
                    onClick={() => onDelete(question.id)}
                    isIconButton
                    icon={<Trash2 size={16} />}
                    disabled={isDeleting}
                    aria-label={`Supprimer la question "${question.title}"`}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </Modal>
);

export default DuplicateQuestionsModal;
