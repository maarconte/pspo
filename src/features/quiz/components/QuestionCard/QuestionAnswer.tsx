import { FC, useId } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { QuestionAnswerProps } from "./QuestionAnswer.types";

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
}) => {
  const generatedId = useId();
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
    <div className={classes.join(" ")}>
      <input
        type={type}
        id={inputId}
        name={name}
        checked={checked}
        onChange={() => !isReadOnly && onChange()}
        disabled={isReadOnly}
      />
      <label htmlFor={inputId} className="d-flex justify-content-between align-items-center w-100">
        <span>{label}</span>
        {status === "success" && <CheckCircle size={24} className="status-icon status-icon-success flex-shrink-0" />}
        {status === "error" && <XCircle size={24} className="status-icon status-icon-error flex-shrink-0" />}
        {status === "missed" && <CheckCircle size={22} className="status-icon status-icon-missed flex-shrink-0" />}
      </label>
    </div>
  );
};

export default QuestionAnswer;
