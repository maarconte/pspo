import "rsuite/dist/rsuite.min.css";

import React, { useEffect, useState } from "react";

import Button from "../components/Button/Button";
import { Button_Style } from "../components/Button/Button.types";
import Counter from "../components/Counter";
import { Drawer } from "rsuite";
import QuestionCard from "../components/QuestionCard";
import QuestionNavigation from "../components/QuestionNavigation/QuestionNavigation";
import QuizzScore from "../components/QuizzScore";
import { toast } from "react-toastify";
import { useQuestionsStore } from "../stores/useQuestionsStore";

export default function Quizz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { questions, setScore, formation } = useQuestionsStore();
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [open, setOpen] = React.useState(false);
  const notificationContent = (questionNumber: number, time: string) => (
    <div className="toast-content">
      <p className="mb-0">{`Question ${questionNumber + 1}`}</p>
      <p className="mb-0 time fs-2">{time}</p>
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
      notificationContent(currentQuestion, formatTime(timeSpent)),
      toastOptions
    );
  };

  const toastOptions: any = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    theme: "colored",
    draggable: false,
    closeButton: false,
    type: toastType(timeSpent),
  };

  useEffect(() => {
    setTimeSpent(0);
  }, [currentQuestion]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (!isPaused) {
      intervalId = setInterval(() => {
        setTimeSpent((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isPaused, currentQuestion]);

  const finishQuizz = () => {
    setIsFinished(true);
    setShowAnswer(true);
    setIsPaused(true);
  };
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      notifyTime();
      setShowAnswer(false);
    } else {
      finishQuizz();
    }
  };
  return (
    <div className="Quizz">
      <div className="container">
        {/* Header */}
        <h1 className="text-center"> Agile.training : {formation}</h1>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Counter
            isPaused={isPaused}
            setIsPaused={setIsPaused}
            finishQuizz={finishQuizz}
          />

          {showAnswer && <QuizzScore />}
          <div className="d-flex gap-1">
            {isFinished ? (
              <Button
                label="Restart"
                style={Button_Style.OUTLINED}
                onClick={() => {
                  setCurrentQuestion(0);
                  setScore(0);
                  setShowAnswer(false);
                  window.location.reload();
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
            onClick={() => {
              setCurrentQuestion(currentQuestion - 1);
              setShowAnswer(false);
            }}
          />
          <Button
            onClick={() => setOpen(true)}
            label="Pagination"
            style={Button_Style.OUTLINED}
          />
          <Button
            label="Next"
            disabled={currentQuestion === questions.length - 1}
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
        {/* <Drawer.Header>
          <Drawer.Title>Navigation</Drawer.Title>
        </Drawer.Header> */}
        <Drawer.Body>
          <QuestionNavigation
            setCurrentQuestion={setCurrentQuestion}
            currentQuestion={currentQuestion}
          />
        </Drawer.Body>
      </Drawer>
    </div>
  );
}
