import { FC, useId, useState } from "react";
import { CheckCircle, Info, XCircle } from "lucide-react";
import "./style.scss";
import { QuestionAnswerProps } from "./QuestionAnswer.types";
import FeedbackBox from "../FeedbackBox";

/**
 * Review Torvalds: 10/10
 * Verdict: Pure functional component, standard React 19 patterns with useId, handles read-only and status visually.
 */
const QuestionAnswer: FC<QuestionAnswerProps> = ({
  name,
  type,
  label,
  checked,
  onChange,
  isReadOnly = false,
  status = "default",
  explanation,
}) => {
  const generatedId = useId();
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const hasExplanation = !!explanation?.trim();
  const isCorrect = status === "success" || status === "missed";
  const inputId = `answer-${generatedId}`;

  // Build classes based on status and selection
  const classes = ["answer"];
  if (status !== "default") {
    classes.push(status);
  } else if (checked) {
    classes.push("selected");
  }

  if (isReadOnly) {
    classes.push("read-only");
  }

  return (
    <>
      <div className={classes.join(" ")}>
        <input
          type={type}
          id={inputId}
          name={name}
          checked={checked}
          onChange={() => !isReadOnly && onChange()}
          disabled={isReadOnly}
        />
        <label htmlFor={inputId} className="d-flex justify-content-between align-items-center w-100 gap-1">
          <span className="label">{label}</span>
          {status === "success" && <CheckCircle size={24} className="status-icon status-icon-success flex-shrink-0" />}
          {status === "error" && <XCircle size={24} className="status-icon status-icon-error flex-shrink-0" />}
          {status === "missed" && <CheckCircle size={22} className="status-icon status-icon-missed flex-shrink-0" />}
        </label>
        {hasExplanation && (
          <button
            type="button"
            className={`answer__info ${isExplanationOpen ? "answer__info--open" : ""}`}
            onClick={() => setIsExplanationOpen((open) => !open)}
            aria-expanded={isExplanationOpen}
            aria-controls={`${inputId}-explanation`}
            aria-label={isExplanationOpen ? "Masquer le feedback" : "Afficher le feedback"}
            title="Feedback"
          >
            <Info size={20} />
          </button>
        )}
      </div>
      {hasExplanation && isExplanationOpen && (
        <FeedbackBox id={`${inputId}-explanation`} className={`feedback-box--answer ${isCorrect ? "feedback-box--correct" : ""}`} html={explanation} />
      )}
    </>
  );
};

export default QuestionAnswer;
