import "rsuite/dist/rsuite.min.css";

import React, { useEffect, useState } from "react";

import { Button } from "../ui";
import { Button_Style } from "../ui/Button/Button.types";
import Counter from "../features/quiz/components/Counter/Counter";
import QuestionCard from "../features/quiz/components/QuestionCard/QuestionCard";
import QuestionNavigation from "../features/quiz/components/QuestionNavigation/QuestionNavigation";
import QuizzScore from "../features/quiz/components/QuizzScore/QuizzScore";
import { Drawer } from "rsuite";
import { toast } from "react-toastify";
import { useQuestionsStore } from "../stores/useQuestionsStore";
import { useQuizStatsStore } from "../stores/useQuizStatsStore";
import { useUserStore } from "../stores/useUserStore";
import { useSaveQuizSession } from "../hooks/useSaveQuizSession";

export default function Quizz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questions = useQuestionsStore((s) => s.questions);
  const setScore = useQuestionsStore((s) => s.setScore);
  const formation = useQuestionsStore((s) => s.formation);
  const calculateScore = useQuestionsStore((s) => s.calculateScore);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [open, setOpen] = React.useState(false);

  const startTracking = useQuizStatsStore((s) => s.startTracking);
  const startQuestion = useQuizStatsStore((s) => s.startQuestion);
  const endQuestion = useQuizStatsStore((s) => s.endQuestion);
  const getSummary = useQuizStatsStore((s) => s.getSummary);
  const resetStats = useQuizStatsStore((s) => s.resetStats);
  const startNewExam = useQuestionsStore((s) => s.startNewExam);

  const user = useUserStore((s) => s.user);
  const { mutate: saveQuizSession } = useSaveQuizSession();

  const notificationContent = (time: string) => (
    <div className="toast-content">
      <p className={`mb-0 time fs-4 fw-bold color-${toastType(timeSpent)}`}>{time}</p>
    </div>
  );

  const toastType = (time: number) => {
    if (time < 45) return "success";
    if (time >= 45 && time <= 90) return "warning";
    return "error";
  };

  const notifyTime = () => {
    if (timeSpent <= 3) return;
    toast(
      notificationContent(formatTime(timeSpent)),
      toastOptions
    );
  };

  const toastOptions: any = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    closeButton: false,
    style: { width: "200px", boxShadow: "none", marginLeft: "auto" },
  };

  // Tracking setup
  useEffect(() => {
    startTracking();
    return () => resetStats();
  }, [startTracking, resetStats]);

  useEffect(() => {
    setTimeSpent(0);
    if (!isFinished) {
      startQuestion(currentQuestion);
    }
  }, [currentQuestion, isFinished, startQuestion]);

  // Saving final stats is now handled synchronously in finishQuizz

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (!isPaused && !isFinished) {
      intervalId = setInterval(() => {
        setTimeSpent((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isPaused, currentQuestion, isFinished]);

  const finishQuizz = () => {
    endQuestion(); // Finalize last question time
    setIsFinished(true);
    setShowAnswer(true);
    setIsPaused(true);

    if (user?.uid) {
      const summary = getSummary?.();
      const finalScore = calculateScore?.();
      if (summary && summary.totalQuestions > 0) {
        saveQuizSession({
          userId: user.uid,
          formation: formation || "unknown",
          score: finalScore || 0,
          totalQuestions: summary.totalQuestions,
          averageTimeMs: summary.averageTimeMs,
          totalTimeMs: summary.totalTimeMs,
          timestamp: Date.now(),
          details: summary.details,
        });
        resetStats?.();
      }
    }
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleQuestionChange = (newIndex: number, shouldNotify = true) => {
    if (shouldNotify) notifyTime();
    setCurrentQuestion(newIndex);
    setShowAnswer(false);
  };

  const nextQuestion = () => {
    if (currentQuestion < (questions?.length || 0) - 1) {
      handleQuestionChange(currentQuestion + 1);
    } else {
      finishQuizz();
    }
  };
  return (
    <div className="Quizz">
      <div className="container">
        {/* Header */}
        <h1 className="text-center">{formation || "Study Group Quiz"}</h1>
        <div className="d-flex justify-content-between align-items-center mb-2">
          {!isFinished && (
            <Counter
              isPaused={isPaused}
              setIsPaused={setIsPaused}
              finishQuizz={finishQuizz}
            />
          )}

          {isFinished && <QuizzScore />}
          <div className="d-flex gap-1">
            {isFinished ? (
              <Button
                label="Restart"
                style={Button_Style.OUTLINED}
                onClick={() => {
                  startNewExam();
                  setCurrentQuestion(0);
                  setScore(0);
                  setShowAnswer(false);
                  setIsFinished(false);
                  setIsPaused(false);
                  setTimeSpent(0);
                }}
              />
            ) : (
              <>
                <Button
                  label={!showAnswer ? "Show the answer" : "Hide the answer"}
                  onClick={() => setShowAnswer(!showAnswer)}
                />
                <Button
                  label="Finish"
                  style={Button_Style.OUTLINED}
                  onClick={() => finishQuizz()}
                />
              </>
            )}
          </div>
        </div>
        {/* Question */}
        {!isFinished
          ? questions[currentQuestion] && (
              <QuestionCard
                question={questions[currentQuestion]}
                currentQuestion={currentQuestion}
                showAnswer={showAnswer}
              />
            )
          : questions.map((question, index) => (
              <QuestionCard
                key={index}
                question={question}
                currentQuestion={index}
                showAnswer={showAnswer}
              />
            ))}
        {/* Navigation */}
        <div className="d-flex justify-content-between">
          <Button
            label="Previous"
            disabled={currentQuestion === 0}
            onClick={() => handleQuestionChange(currentQuestion - 1, false)}
          />
          <Button
            onClick={() => setOpen(true)}
            label="Pagination"
            style={Button_Style.OUTLINED}
          />
          <Button
            label="Next"
            disabled={currentQuestion === (questions?.length || 0) - 1}
            onClick={() => nextQuestion()}
          />
        </div>
      </div>
      <Drawer
        backdrop={false}
        open={open}
        onClose={() => setOpen(false)}
        size={"xs"}
      >
        <Drawer.Header>
          <Drawer.Title>Navigation</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <QuestionNavigation
            setCurrentQuestion={handleQuestionChange}
            currentQuestion={currentQuestion}
          />
        </Drawer.Body>
      </Drawer>
    </div>
  );
}
