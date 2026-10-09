import "./style.scss";

import { ChevronDown } from "lucide-react";
import { Progress } from "rsuite";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";
import { computeDomainScores } from "../../utils/computeDomainScores";

export default function DomainScores() {
  const questions = useQuestionsStore((s) => s.questions);
  const userAnswers = useQuestionsStore((s) => s.userAnswers);

  const scores = computeDomainScores(questions, userAnswers);
  if (scores.length === 0) return null;

  return (
    <details className="DomainScores">
      <summary className="DomainScores__header">
        <h3 className="DomainScores__title">Score per domain</h3>
        <ChevronDown size={20} className="DomainScores__chevron" />
      </summary>
      <ul className="DomainScores__list">
        {scores.map(({ domain, correct, total, percentage }) => (
          <li key={domain} className="DomainScores__item">
            <div className="DomainScores__label">
              <span>{domain}</span>
              <span className="DomainScores__count">
                {correct}/{total}
              </span>
            </div>
            <Progress.Line percent={percentage} strokeColor="#5236ab" />
          </li>
        ))}
      </ul>
    </details>
  );
}
