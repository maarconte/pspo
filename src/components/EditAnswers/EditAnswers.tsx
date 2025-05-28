import "./style.scss";
import "./style-mobile.scss";

import React, { FC, useEffect, useState } from "react";

import { EditAnswersProps } from "./EditAnswers.types";
import Input from "../Input";

const EditAnswers: FC<EditAnswersProps> = ({ answerType, answers }) => {
  return (
    <div className="EditAnswers">
      <div className="EditAnswers__header">
        <h3>Answers</h3>
      </div>
      <div className="EditAnswers__content">
        <div className="EditAnswers__content__input">
          {answers?.map((answer, index) => (
            <Input
              key={index}
              value={answer}
              label={`Answer ${index + 1}`}
              onChange={() => {}}
              name={`answer-${index}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditAnswers;
