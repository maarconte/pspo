import "./style.scss";
import "./style-mobile.scss";

import React, { FC, useContext, useState } from "react";

import Feedback from "../Feedback";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QuestionCardProps } from "./QuestionCard.types";
import { QuestionsContext } from "../../utils/context";
import { UserAnswer } from "../../utils/types";
import { faBookmark as faBookBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";

const QuestionCard: FC<QuestionCardProps> = ({
  question,
  currentQuestion,
  showAnswer,
}) => {
  const { userAnswers, setUserAnswers } = useContext(QuestionsContext);
  const inputType = question.answerType === "M" ? "checkbox" : "radio";

  const getAnswerClass = (index: number) => {
    if (showAnswer) {
      if (question.answerType === "TF") {
        const answer = index === 0 ? true : false;
        return answer === question.answer ? "success" : "";
      } else if (question.answerType === "M") {
        if (Array.isArray(question.answer)) {
          return question.answer.includes(index) ? "success" : "";
        }
      } else {
        return index === question.answer ? "success" : "";
      }
    }
    return "";
  };

  const handleChangeBoolean = (e: any) => {
    const newValue = {
      question: currentQuestion,
      answer: e.target.value === "1" ? true : false,
      isBookmarked: userAnswers[currentQuestion]?.isBookmarked,
    };
    const newArray = [...userAnswers];
    newArray[currentQuestion] = newValue;

    setUserAnswers(newArray);
  };

  const handleChangeMultiple = () => {
    const answers = userAnswers.filter(
      (answer) => answer.question !== currentQuestion
    );
    const selectedAnswers = Array.from(
      document.querySelectorAll('input[type="checkbox"]:checked')
    ).map((input: any) => parseInt(input.value));
    setUserAnswers([
      ...answers,
      {
        question: currentQuestion,
        answer: selectedAnswers,
        isBookmarked: userAnswers[currentQuestion]?.isBookmarked,
      },
    ]);
  };

  const handleChangeRadio = (index: number) => {
    const newValue: UserAnswer = {
      question: currentQuestion,
      answer: index,
      isBookmarked: userAnswers[currentQuestion]?.isBookmarked,
    };
    const newArray = [...userAnswers];
    newArray[currentQuestion] = newValue;

    setUserAnswers(newArray);
  };

  const handleChangeBookmark = () => {
    const newArray = [...userAnswers];
    newArray[currentQuestion] = {
      ...newArray[currentQuestion],
      isBookmarked: !newArray[currentQuestion]?.isBookmarked,
    };
    setUserAnswers(newArray);
  };

  function isCheckboxChecked(value: any, index: number): value is number[] {
    if (value instanceof Array) {
      for (const item of value) {
        if (typeof item !== "number") {
          return false;
        }
      }
      if (value.includes(index)) {
        return true;
      }
    }
    return false;
  }

  const answers = question?.answers?.map((answer, index) => (
    <div key={index} className={`answer ${getAnswerClass(index)}`}>
      <input
        type={inputType}
        id={answer}
        name={`answer-${currentQuestion}-${index}`}
        checked={
          userAnswers[currentQuestion]?.answer === index
            ? true
            : isCheckboxChecked(userAnswers[currentQuestion]?.answer, index)
        }
        value={index}
        onChange={() =>
          inputType === "radio"
            ? handleChangeRadio(index)
            : handleChangeMultiple()
        }
      />
      <label htmlFor={`answer-${currentQuestion}-${index}`}>{answer}</label>
    </div>
  ));

  const trueFalseAnswers = (
    <>
      <div className={`answer ${getAnswerClass(0)}`}>
        <input
          type="radio"
          id={`${currentQuestion.toString()}_true`}
          name="answer"
          checked={userAnswers[currentQuestion]?.answer === true}
          value={1}
          onChange={(e) => handleChangeBoolean(e)}
        />
        <label htmlFor={`${currentQuestion.toString()}_true`}>True</label>
      </div>
      <div className={`answer ${getAnswerClass(1)}`}>
        <input
          type="radio"
          id={`${currentQuestion.toString}_false`}
          name="answer"
          checked={userAnswers[currentQuestion]?.answer === false}
          value={0}
          onChange={(e) => handleChangeBoolean(e)}
        />
        <label htmlFor={`${currentQuestion.toString}_false`}>False</label>
      </div>
    </>
  );
  return (
    <div className="QuestionCard">
      <div className="d-flex justify-content-between gap-1">
        <h2 className="h4">
          {currentQuestion + 1}. {question.title}
        </h2>
        <FontAwesomeIcon
          icon={
            userAnswers[currentQuestion]?.isBookmarked
              ? faBookmark
              : faBookBookmarkRegular
          }
          onClick={() => handleChangeBookmark()}
          className="bookmark"
        />
      </div>
      <div className="d-flex flex-column">
        {question?.answerType === "TF" ? trueFalseAnswers : answers}
      </div>
      {showAnswer && <Feedback question={question} />}
    </div>
  );
};

export default QuestionCard;
