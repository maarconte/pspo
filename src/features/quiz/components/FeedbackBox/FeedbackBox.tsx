import "./style.scss";

import { FC } from "react";
import SafeHtml from "../../../../ui/SafeHtml/SafeHtml";

interface FeedbackBoxProps {
  html?: string;
  emptyLabel?: string;
  className?: string;
  id?: string;
}

/** Shared feedback panel, used for both the general and per-answer feedback. */
const FeedbackBox: FC<FeedbackBoxProps> = ({ html, emptyLabel, className, id }) => (
  <div id={id} className={["feedback-box", className].filter(Boolean).join(" ")}>
    <strong>Feedback: </strong>
    {html?.trim() ? <SafeHtml html={html} /> : emptyLabel}
  </div>
);

export default FeedbackBox;
