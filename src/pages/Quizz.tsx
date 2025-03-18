import React, { useState } from "react";

import Button from "../components/Button/Button";
import { Button_Style } from "../components/Button/Button.types";
import Counter from "../components/Counter";
import Input from "../components/Input";
import QuestionCard from "../components/QuestionCard";
import { QuestionsContext } from "../utils/context";
import QuizzScore from "../components/QuizzScore";

export default function Quizz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { questions, setScore, formation } = React.useContext(QuestionsContext);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const finishQuizz = () => {
    setIsFinished(true);
    setShowAnswer(true);
    setIsPaused(true);
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
          <div className="d-flex gap-1 align-items-center">
            <Input
              value={currentQuestion + 1}
              type="number"
              className="m-0 w-25 hide-arrows"
              onChange={(e) => {
                setCurrentQuestion(e.target.value - 1);
                setShowAnswer(false);
              }}
            />
            <span>of {questions.length}</span>
          </div>
          <Button
            label="Next"
            disabled={currentQuestion === questions.length - 1}
            onClick={() => {
              setCurrentQuestion(currentQuestion + 1);
              setShowAnswer(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}
