import React, { FC, useEffect, useMemo } from "react";
import "./style.scss";
import { Trophy, ClipboardCheck, Timer, AlertTriangle } from "lucide-react";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";

const QuizzScore: FC = () => {
  const score = useQuestionsStore((s) => s.score);
  const setScore = useQuestionsStore((s) => s.setScore);
  const userAnswers = useQuestionsStore((s) => s.userAnswers);
  const questions = useQuestionsStore((s) => s.questions);
  const totalTimeSpent = useQuestionsStore((s) => s.totalTimeSpent);

  const answeredCount = useMemo(() =>
    userAnswers?.filter((a) => a?.answer !== undefined).length || 0
  , [userAnswers]);

  const percent = useMemo(() =>
    answeredCount > 0 ? Math.round((score / answeredCount) * 100) : 0
  , [score, answeredCount]);

  useEffect(() => {
    let currentScore = 0;
    userAnswers?.forEach((userAnswer) => {
      if (!userAnswer || !questions[userAnswer.question]) return;

      const question = questions[userAnswer.question];
      const correctAnswer = question?.answer;
      const userAnswerValue = userAnswer?.answer;

      if (Array.isArray(correctAnswer) && Array.isArray(userAnswerValue)) {
        if (correctAnswer.length === userAnswerValue.length) {
          const sortedCorrect = [...correctAnswer].sort();
          const sortedUser = [...userAnswerValue].sort();
          if (sortedCorrect.every((val, idx) => val === sortedUser[idx])) {
            currentScore++;
          }
        }
      } else if (correctAnswer === userAnswerValue) {
        currentScore++;
      }
    });
    setScore(currentScore);
  }, [userAnswers, questions, setScore]);

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  const isPassed = percent >= 85;

  return (
    <div className="quizz-score-dashboard">
      <div className="stats-overview-grid">
        {/* Score Card */}
        <div className={`stat-card ${isPassed ? "success" : "danger"}`}>
          <div className="icon-container">
            {isPassed ? <Trophy size={24} strokeWidth={2.5} /> : <AlertTriangle size={24} strokeWidth={2.5} />}
          </div>
          <div className="stat-content">
            <strong>{percent}%</strong>
            <span>Score Final</span>
          </div>
        </div>

        {/* Progression Card */}
        <div className="stat-card info">
          <div className="icon-container">
            <ClipboardCheck size={24} strokeWidth={2.5} />
          </div>
          <div className="stat-content">
            <strong>{answeredCount} / {questions.length}</strong>
            <span>Questions</span>
          </div>
        </div>

        {/* Time Card */}
        <div className="stat-card warning">
          <div className="icon-container">
            <Timer size={24} strokeWidth={2.5} />
          </div>
          <div className="stat-content">
            <strong>{formatDuration(totalTimeSpent)}</strong>
            <span>Temps total</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizzScore;
