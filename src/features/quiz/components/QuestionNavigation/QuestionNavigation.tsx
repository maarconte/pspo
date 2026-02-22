import "./style.scss";

import { useMemo } from "react";
import { UserAnswer } from "../../../../utils/types";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";
import { QuestionNavigationButton } from "./QuestionNavigationButton";

type Props = {
  setCurrentQuestion: (index: number) => void;
  currentQuestion: number;
};

export default function QuestionNavigation({
  setCurrentQuestion,
  currentQuestion,
}: Props) {
  const { userAnswers, questions } = useQuestionsStore();
  const count = questions.length > 0 ? questions.length : 80;

  const answersMap = useMemo(() => {
    const map = new Map<number, UserAnswer>();
    userAnswers.forEach((answer) => {
      if (answer) {
        map.set(answer.question, answer);
      }
    });
    return map;
  }, [userAnswers]);

  return (
    <div className="QuestionNavigation">
      {Array.from({ length: count }, (_, i) => (
        <QuestionNavigationButton
          key={i}
          index={i}
          isActive={currentQuestion === i}
          setCurrentQuestion={setCurrentQuestion}
          userAnswer={answersMap.get(i)}
        />
      ))}
    </div>
  );
}
