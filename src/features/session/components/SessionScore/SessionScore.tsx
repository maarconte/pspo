import { useEffect, useState } from 'react';
import { useSessionStore } from '../../stores/useSessionStore';
import './style.scss';

interface SessionScoreProps {
  userAnswers: Array<{
    question: number;
    answer: string | string[];
    isBookmarked?: boolean;
  }>;
}

const SessionScore: React.FC<SessionScoreProps> = ({ userAnswers }) => {
  const { activeSession } = useSessionStore();
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!activeSession || !activeSession.questions) return;

    let correctCount = 0;
    userAnswers.forEach((userAnswer) => {
      if (!userAnswer || userAnswer.answer === null || userAnswer.answer === undefined) return;

      const question = activeSession.questions[userAnswer.question];
      if (!question) return;

      const correctAnswer = question.correctAnswer;
      const userAnswerString = Array.isArray(userAnswer.answer)
        ? userAnswer.answer.join(', ')
        : String(userAnswer.answer);

      if (userAnswerString === correctAnswer) {
        correctCount++;
      }
    });

    setScore(correctCount);
  }, [userAnswers, activeSession]);

  const totalAnswered = userAnswers.filter(a => a && (a.answer !== null && a.answer !== undefined && a.answer !== '')).length;
  const percent = totalAnswered > 0 ? ((score / totalAnswered) * 100).toFixed(0) : '0';
  const percentNumber = parseFloat(percent);

  return (
    <div className="SessionScore mb-4">
      <p className="displayScore-title">Score actuel</p>
      <p className="percent">
        {isNaN(percentNumber) ? 0 : percentNumber}%
      </p>
    </div>
  );
};

export default SessionScore;
