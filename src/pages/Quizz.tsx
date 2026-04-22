import React, { useEffect, useRef, useState } from "react";

import { Button } from "../ui";
import { Button_Style, Button_Type } from "../ui/Button/Button.types";
import Counter from "../features/quiz/components/Counter/Counter";
import QuestionCard from "../features/quiz/components/QuestionCard/QuestionCard";
import QuestionNavigation from "../features/quiz/components/QuestionNavigation/QuestionNavigation";
import QuizzScore from "../features/quiz/components/QuizzScore/QuizzScore";
import { Drawer } from "rsuite";
import Modal from "../ui/Modal/Modal";
import { toast } from "react-toastify";
import { useQuestionsStore } from "../stores/useQuestionsStore";
import { useQuizStatsStore } from "../stores/useQuizStatsStore";
import { useUserStore } from "../stores/useUserStore";
import { useSaveQuizSession } from "../hooks/useSaveQuizSession";
import { useCoopStore } from "../stores/useCoopStore";
import { AlertTriangle, Trophy, User } from "lucide-react";
import StatCard from "../ui/StatCard/StatCard";

export default function Quizz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questions = useQuestionsStore((s) => s.questions);
  const setScore = useQuestionsStore((s) => s.setScore);
  const formation = useQuestionsStore((s) => s.formation);
  const calculateScore = useQuestionsStore((s) => s.calculateScore);
  const getSuccessPercentage = useQuestionsStore((s) => s.getSuccessPercentage);
  const userAnswers = useQuestionsStore((s) => s.userAnswers);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  // useRef: no re-render needed — only used in the toast callback
  const timeSpentRef = useRef(0);
  const [open, setOpen] = React.useState(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  const startTracking = useQuizStatsStore((s) => s.startTracking);
  const startQuestion = useQuizStatsStore((s) => s.startQuestion);
  const endQuestion = useQuizStatsStore((s) => s.endQuestion);
  const getSummary = useQuizStatsStore((s) => s.getSummary);
  const resetStats = useQuizStatsStore((s) => s.resetStats);
  const startNewExam = useQuestionsStore((s) => s.startNewExam);

  const user = useUserStore((s) => s.user);
  const { mutate: saveQuizSession } = useSaveQuizSession();
  const setTotalTimeSpent = useQuestionsStore((s) => s.setTotalTimeSpent);

  const { participants } = useCoopStore();
  const currentParticipant = participants.length > 0 ? participants[currentQuestion % participants.length] : null;

  const notificationContent = (time: string) => (
    <div className="toast-content">
      <p className={`mb-0 time fs-4 fw-bold color-${toastType(timeSpentRef.current)}`}>
        {time}
      </p>
    </div>
  );

  const toastType = (time: number) => {
    if (time < 45) return "success";
    if (time >= 45 && time <= 90) return "warning";
    return "error";
  };

  const notifyTime = () => {
    if (timeSpentRef.current <= 3) return;
    toast(notificationContent(formatTime(timeSpentRef.current)), toastOptions);
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
    timeSpentRef.current = 0;
    if (!isFinished) {
      startQuestion(currentQuestion);
    }
  }, [currentQuestion, isFinished, startQuestion]);

  // Saving final stats is now handled synchronously in finishQuizz

  const handleEndQuestion = (index: number) => {
    const question = questions[index];
    const userAnswer = userAnswers[index];
    if (!question) return;

    const correctAnswer = question.answer;
    const userAnswerValue = userAnswer?.answer;
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

    endQuestion({
      questionId: question.id,
      isCorrect,
      userAnswer: userAnswerValue ?? null,
      isBookmarked: !!userAnswer?.isBookmarked,
    });
  };

  const finishQuizz = () => {
    handleEndQuestion(currentQuestion); // Finalize current question time
    setIsFinished(true);
    setShowAnswer(true);
    setIsPaused(true);

    if (user?.uid) {
      const summary = getSummary?.();
      const finalScore = calculateScore?.();

      if (summary) {
        setTotalTimeSpent(summary.totalTimeMs);
      }

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
        setOpen(true); // Open pagination drawer automatically when finished
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
    handleEndQuestion(currentQuestion);
    if (shouldNotify) notifyTime();
    setCurrentQuestion(newIndex);
    if (!isFinished) setShowAnswer(false);

    if (isFinished) {
      setTimeout(() => {
        const element = document.getElementById(`question-${newIndex}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  const handleRestart = () => {
    startNewExam();
    setCurrentQuestion(0);
    setScore(0);
    setShowAnswer(false);
    setIsFinished(false);
    setIsPaused(false);
    timeSpentRef.current = 0;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextQuestion = () => {
    if (currentQuestion < (questions?.length || 0) - 1) {
      handleQuestionChange(currentQuestion + 1);
    } else {
      finishQuizz();
    }
  };
  return (
    <div className="Quizz p-2">
      <div className="container">
        {/* Header */}
        <h1 className="text-center mb-2">{formation || "Study Group Quiz"}</h1>

        <div className="d-flex justify-content-between align-items-center mb-2">
          {!isFinished && (
            <Counter
              isPaused={isPaused}
              setIsPaused={setIsPaused}
              finishQuizz={finishQuizz}
              currentQuestion={currentQuestion}
              onTick={(seconds) => { timeSpentRef.current = seconds; }}
            />
          )}

          {isFinished && (
            <div className="w-100 d-flex flex-column gap-2 mb-2">
              <QuizzScore />
              <div className="d-flex justify-content-center gap-1">
                <Button
                  label="Restart Quiz"
                  type={Button_Type.PRIMARY}
                  onClick={handleRestart}
                />
                <Button
                  label="Navigation"
                  style={Button_Style.OUTLINED}
                  onClick={() => setOpen(!open)}
                />
              </div>
            </div>
          )}
          {!isFinished &&
            (() => {
              const answeredCount = userAnswers.filter(
                (a) => a?.answer !== undefined,
              ).length;
              const correctCount = getSuccessPercentage();
              const isPassed = correctCount >= 85;
              return (
                <div className="d-flex gap-1 align-items-center flex-wrap">
                  {showAnswer && (
                    <StatCard
                      variant={isPassed ? "success" : "danger"}
                      isFeatured={true}
                      icon={
                        isPassed ? (
                          <Trophy size={24} strokeWidth={2.5} />
                        ) : (
                          <AlertTriangle size={24} strokeWidth={2.5} />
                        )
                      }
                      value={
                        answeredCount === 0
                          ? "—"
                          : `${correctCount}%`
                      }
                      label="Current Score"
                    />
                  )}
                  <Button
                    label={!showAnswer ? "Show the answer" : "Hide the answer"}
                    onClick={() => setShowAnswer(!showAnswer)}
                  />
                  <Button
                    label="Finish"
                    style={Button_Style.OUTLINED}
                    onClick={() => {
                      setIsFinishModalOpen(true);
                      setIsPaused(true);
                    }}
                  />
                </div>
              );
            })()}
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
                showAnswer={true}
              />
            ))}
        {/* Navigation / Bottom Restart */}
        {isFinished ? (
          <div className="d-flex justify-content-center mt-5 mb-5">
            <Button
              label="Restart Quiz"
              type={Button_Type.PRIMARY}
              onClick={handleRestart}
            />
          </div>
        ) : (
          <div className="d-flex justify-content-between">
            <Button
              label="Previous"
              disabled={currentQuestion === 0}
              onClick={() => handleQuestionChange(currentQuestion - 1, false)}
            />
            <Button
              onClick={() => setOpen(true)}
              label="Navigation"
              style={Button_Style.OUTLINED}
            />
            <Button
              label="Next"
              disabled={currentQuestion === (questions?.length || 0) - 1}
              onClick={() => nextQuestion()}
            />
          </div>
        )}
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
            isFinished={isFinished}
          />
        </Drawer.Body>
      </Drawer>
      <Modal
        isOpen={isFinishModalOpen}
        onClose={() => {
          setIsFinishModalOpen(false);
          setIsPaused(false);
        }}
        setIsClosed={setIsFinishModalOpen}
        title="Finish"
        labelOnConfirm="Finish"
        labelOnCancel="Cancel"
        onConfirm={() => {
          setIsFinishModalOpen(false);
          finishQuizz();
        }}
        type="warning"
      >
        <p>Are you sure you want to finish your session?</p>
      </Modal>

      {/* Coop Participant Display */}
      {!isFinished && participants.length > 1 && currentParticipant && (
        <div
          className={`coop-current-participant ${open ? "drawer-open" : ""}`}
        >
          <p className="coop-current-participant__name"><User size={24}/> {currentParticipant}</p>
        </div>
      )}
    </div>
  );
}
