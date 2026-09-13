import "./style.scss";

import Button from "../../../Button/Button";
import { Button_Style } from "../../../Button/Button.types";
import { FC } from "react";
import { Feedback } from "../../../../features/quiz";
import { getFormationLabel } from "../../../../utils/helpers/formationLabel";
import { ImportPreviewModalProps } from "./ImportPreviewModal.types";
import Modal from "../../../Modal/Modal";
import { QuestionDraft } from "../utils/csvImport";
import SafeHtml from "../../../SafeHtml/SafeHtml";
import { Trash2 } from "lucide-react";

const isCorrectOption = (question: QuestionDraft, index: number): boolean =>
  Array.isArray(question.answer)
    ? question.answer.includes(index)
    : question.answer === index;

const ImportPreviewModal: FC<ImportPreviewModalProps> = ({
  isOpen,
  questions,
  isImporting,
  onRemove,
  onConfirm,
  onClose,
}) => (
  <Modal
    isOpen={isOpen}
    setIsClosed={onClose}
    onClose={onClose}
    onConfirm={onConfirm}
    title={`Aperçu de l'import (${questions.length} question${
      questions.length > 1 ? "s" : ""
    })`}
    labelOnConfirm={`Importer ${questions.length} question${
      questions.length > 1 ? "s" : ""
    }`}
    labelOnCancel="Annuler"
    isConfirmLoading={isImporting}
    confirmButtonDisabled={questions.length === 0}
    closeOnBackdropClick={!isImporting}
  >
    <div className="ImportPreviewModal">
      <p>
        Vérifie les questions avant de les ajouter définitivement à la base.
        Retire celles qui ne conviennent pas avec l'icône corbeille.
      </p>
      <div className="ImportPreviewModal__list">
        {questions.map((question, index) => (
          <div className="ImportPreviewModal__item" key={index}>
            <div className="ImportPreviewModal__item-header">
              <span className="ImportPreviewModal__index">{index + 1}</span>
              <strong className="ImportPreviewModal__title">
                {question.title}
              </strong>
              <Button
                style={Button_Style.OUTLINED}
                onClick={() => onRemove(index)}
                isIconButton
                icon={<Trash2 size={16} />}
                disabled={isImporting}
                aria-label={`Retirer la question ${index + 1} de l'import`}
              />
            </div>

            <div className="ImportPreviewModal__badges">
              <span className="badge">{getFormationLabel(question.type)}</span>
              <span className="badge">{question.answerType}</span>
              {question.domain && (
                <span className="badge">{question.domain}</span>
              )}
            </div>

            <ul className="ImportPreviewModal__answers">
              {question.answerType === "TF" ? (
                <>
                  <li className={question.answer === true ? "bg-success" : ""}>
                    Vrai
                    {question.answerExplanations?.[0] && (
                      <p className="text-muted  mb-0">
                        {question.answerExplanations[0]}
                      </p>
                    )}
                  </li>
                  <li className={question.answer === false ? "bg-success" : ""}>
                    Faux
                    {question.answerExplanations?.[1] && (
                      <p className="text-muted  mb-0">
                        {question.answerExplanations[1]}
                      </p>
                    )}
                  </li>
                </>
              ) : (
                question.answers.map((answer, answerIndex) => (
                  <li
                    key={answerIndex}
                    className={
                      isCorrectOption(question, answerIndex) ? "bg-success" : ""
                    }
                  >
                    {answer}
                    {question.answerExplanations?.[answerIndex] && (
                      <p className="text-muted mb-0">
                        {question.answerExplanations[answerIndex]}
                      </p>
                    )}
                  </li>
                ))
              )}
            </ul>

            {question.feedback && (
              <Feedback question={question} showReportButton={false} />
            )}
          </div>
        ))}
        {questions.length === 0 && (
          <p className="text-muted">
            Plus aucune question à importer — tout a été retiré de l'aperçu.
          </p>
        )}
      </div>
    </div>
  </Modal>
);

export default ImportPreviewModal;
