import "./style.scss";
import "./style-mobile.scss";

import React, { FC, useContext, useEffect } from "react";

import { QuestionsContext } from "../../utils/context";
import { QuizzScoreProps } from "./QuizzScore.types";

const QuizzScore: FC<QuizzScoreProps> = () => {
  const { score, setScore, userAnswers, questions } =
    useContext(QuestionsContext);
  const percent = ((score / userAnswers.length) * 100).toFixed(0);
  const percentNumber = parseFloat(percent); // Convertir en nombre

  // get the quizz score by comparing the user answers with the correct answers
  useEffect(() => {
    let score = 0;
    userAnswers.forEach((userAnswer) => {
      const question = questions[userAnswer.question];
      const correctAnswer = question.answer;
      console.log(correctAnswer, userAnswer.answer);
      // check if 2 arrays are equal
      if (Array.isArray(correctAnswer) && Array.isArray(userAnswer.answer)) {
        if (
          correctAnswer.length === userAnswer.answer.length &&
          (correctAnswer as any[]).every(
            (value, index) => value === (userAnswer.answer as any[])[index]
          )
        ) {
          score++;
        }
      } else if (correctAnswer === userAnswer.answer) {
        score++;
      }
    });
    setScore(score);
    console.log(score);
  }, [userAnswers, questions]);

  return (
    <div className="QuizzScore">
      <p className="displayScore-title">Score actuel</p>
      <p className="percent">
        {
          // if is not a number, display 0
          isNaN(percentNumber) ? 0 : percentNumber
        }
        %
      </p>
    </div>
  );
};

export default QuizzScore;
