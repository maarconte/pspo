import "./style.scss";

import { Progress } from "rsuite";
import { computeDomainScores } from "../../utils/computeDomainScores";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";

export default function DomainScores() {
  const questions = useQuestionsStore((s) => s.questions);
  const userAnswers = useQuestionsStore((s) => s.userAnswers);

  const scores = computeDomainScores(questions, userAnswers);
  if (scores.length === 0) return null;

  return (
    <section className="DomainScores">
      <h3 className="DomainScores__title">Score per domain</h3>
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
    </section>
  );
}
