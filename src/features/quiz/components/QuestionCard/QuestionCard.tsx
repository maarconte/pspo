import "./style.scss";
import "./style-mobile.scss";

import { Button_Style, Button_Type } from "../../../../ui/Button/Button.types";
import { FC, useContext, useState, memo } from "react";
import { Bookmark } from "lucide-react";

import Alert from "../../../../ui/Alert/Alert";
import Button from "../../../../ui/Button/Button";
import Feedback from "../Feedback";
import Modal from "../../../../ui/Modal/Modal";
import { QuestionCardProps } from "./QuestionCard.types";
import { UserAnswer } from "../../../../utils/types";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";

const QuestionCard = memo(({
  question,
  currentQuestion,
  showAnswer,
}: QuestionCardProps) => {
  // Optimization: Select only the answer for the current question
  const userAnswer = useQuestionsStore((state) => state.userAnswers[currentQuestion]);
  const setUserAnswers = useQuestionsStore((state) => state.setUserAnswers);

  const inputType = question.answerType === "M" ? "checkbox" : "radio";
  const [showComments, setShowComments] = useState(false);
  const selectedClass = (index: number) => {
    const currentActualAnswer = userAnswer?.answer;
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
    setUserAnswers((prev) => {
      const newValue = {
        question: currentQuestion,
        answer: e.target.value === "1" ? true : false,
        isBookmarked: prev[currentQuestion]?.isBookmarked,
      };
      const newArray = [...prev];
      newArray[currentQuestion] = newValue;
      return newArray;
    });
  };

  const handleChangeMultiple = () => {
    const selectedAnswers = Array.from(
      document.querySelectorAll('input[type="checkbox"]:checked')
    ).map((input: any) => parseInt(input.value));

    setUserAnswers((prev) => {
      const newValue = {
        question: currentQuestion,
        answer: selectedAnswers,
        isBookmarked: prev[currentQuestion]?.isBookmarked,
      };
      const newArray = [...prev];
      newArray[currentQuestion] = newValue;
      return newArray;
    });
  };

  const handleChangeRadio = (index: number) => {
    setUserAnswers((prev) => {
      const newValue: UserAnswer = {
        question: currentQuestion,
        answer: index,
        isBookmarked: prev[currentQuestion]?.isBookmarked,
      };
      const newArray = [...prev];
      newArray[currentQuestion] = newValue;
      return newArray;
    });
  };

  const handleChangeBookmark = () => {
    setUserAnswers((prev) => {
      const newArray = [...prev];
      newArray[currentQuestion] = {
        ...newArray[currentQuestion],
        isBookmarked: !newArray[currentQuestion]?.isBookmarked,
      };
      return newArray;
    });
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
          userAnswer?.answer === index
            ? true
            : isCheckboxChecked(userAnswer?.answer, index)
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
          checked={userAnswer?.answer === true}
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
          checked={userAnswer?.answer === false}
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
          size={42}
          fill={userAnswer?.isBookmarked ? "#f6b223" : "none"}
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
});

export default QuestionCard;
