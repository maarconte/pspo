import "./style.scss";

import { useQuestionsStore } from "../../../../stores/useQuestionsStore";

type Props = {
  setCurrentQuestion: (index: number) => void;
  currentQuestion: number;
  isFinished?: boolean;
};

export default function QuestionNavigation({
  setCurrentQuestion,
  currentQuestion,
  isFinished = false,
}: Props) {
  const userAnswers = useQuestionsStore((s) => s.userAnswers);
  const questions = useQuestionsStore((s) => s.questions);

  const isQuestionAnswered = (index: number) => {
    const userAnswer = userAnswers?.[index];
    return userAnswer?.answer !== undefined;
  };

  const isBookmarked = (index: number) => {
    return !!userAnswers?.[index]?.isBookmarked;
  };

  const getQuestionStatus = (index: number) => {
    if (!isFinished) return "";

    const question = questions[index];
    const userAnswer = userAnswers[index];
    if (!question || !userAnswer || userAnswer.answer === undefined) return "not-answered";

    const correctAnswer = question.answer;
    const userAnswerValue = userAnswer.answer;
    let isCorrect = false;

    if (Array.isArray(correctAnswer) && Array.isArray(userAnswerValue)) {
      if (correctAnswer.length === userAnswerValue.length) {
        const sortedCorrect = [...correctAnswer].sort();
        const sortedUser = [...userAnswerValue].sort();
        isCorrect = sortedCorrect.every((val, idx) => val === sortedUser[idx]);
      }
    } else {
      isCorrect = correctAnswer === userAnswerValue;
    }

    return isCorrect ? "correct" : "incorrect";
  };

  return (
    <div className="QuestionNavigation">
      {Array.from({ length: questions?.length || 0 }, (_, i) => {
        const isCurrent = currentQuestion === i;
        const answered = isQuestionAnswered(i);
        const bookmarked = isBookmarked(i);
        const status = getQuestionStatus(i);

        return (
          <button
            key={i}
            onClick={() => setCurrentQuestion(i)}
            className={`QuestionNavigation__button ${
              isCurrent ? "active" : ""
            } ${answered ? "answered" : ""} ${
              bookmarked ? "bookmarked" : ""
            } ${status}`}
            disabled={isCurrent && !isFinished}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
