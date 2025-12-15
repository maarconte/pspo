import "./style.scss";
import "./style-mobile.scss";

import { Button_Style, Button_Type } from "../../../../ui/Button/Button.types";
import { FC, useContext, useState } from "react";
import { Bookmark } from "lucide-react";

import Alert from "../../../../ui/Alert/Alert";
import Button from "../../../../ui/Button/Button";
import Feedback from "../Feedback";
import Modal from "../../../../ui/Modal/Modal";
import { QuestionCardProps } from "./QuestionCard.types";
import { UserAnswer } from "../../../../utils/types";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";

const QuestionCard: FC<QuestionCardProps> = ({
  question,
  currentQuestion,
  showAnswer,
}) => {
  const { userAnswers, setUserAnswers } = useQuestionsStore();
  const inputType = question.answerType === "M" ? "checkbox" : "radio";
  const [showComments, setShowComments] = useState(false);
  const selectedClass = (index: number) => {
    const currentActualAnswer = userAnswers[currentQuestion]?.answer;
    if (
      currentActualAnswer === index ||
      (question.answerType === "M" &&
        Array.isArray(currentActualAnswer) &&
        currentActualAnswer.includes(index)) ||
      (question.answerType === "TF" &&
        currentActualAnswer === true &&
        index === 0) ||
      (question.answerType === "TF" &&
        currentActualAnswer === false &&
        index === 1)
    ) {
      return "selected";
    }
  };
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
    if (Array.isArray(value)) {
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
    <div
      key={index}
      className={`answer ${selectedClass(index)} ${getAnswerClass(index)} `}
    >
      <input
        type={inputType}
        id={`answer-${currentQuestion}-${index}`}
        name={`answer-${currentQuestion}-${index}`}
        checked={
          userAnswers[currentQuestion]?.answer === index
            ? true
            : isCheckboxChecked(userAnswers[currentQuestion]?.answer, index)
        }
        value={index}
        onChange={() => {
          inputType === "radio"
            ? handleChangeRadio(index)
            : handleChangeMultiple();
        }}
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
      {question?.isFlagged && (
        <Alert severity="error">
          <div className="d-flex align-items-center justify-content-between w-100">
            This question has been flagged for review
            <Button
              label="Show comments"
              onClick={() => setShowComments(true)}
              style={Button_Style.LINK}
              type={Button_Type.SECONDARY}
            />
          </div>
        </Alert>
      )}
      {showComments && (
        <Modal
          title="Comments"
          onClose={() => setShowComments(false)}
          setIsClosed={setShowComments}
          isOpen={showComments}
        >
          {question.comments?.map((comment, index) => (
            <p key={index} className="comment">
              {comment}
            </p>
          ))}
        </Modal>
      )}
      <div className="d-flex justify-content-between gap-1">
        <h2 className="h4">
          {currentQuestion + 1}. {question.title}
        </h2>
        <Bookmark
          size={16}
          color="#8b78c7"
          fill={userAnswers[currentQuestion]?.isBookmarked ? "#8b78c7" : "none"}
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
