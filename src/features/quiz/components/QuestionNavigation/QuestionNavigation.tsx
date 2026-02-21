import "./style.scss";

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
  const { userAnswers } = useQuestionsStore();

  return (
    <div className="QuestionNavigation">
      {Array.from({ length: 80 }, (_, i) => (
        <QuestionNavigationButton
          key={i}
          index={i}
          isActive={currentQuestion === i}
          setCurrentQuestion={setCurrentQuestion}
          userAnswer={userAnswers[i]}
        />
      ))}
    </div>
  );
}
