import "./style.scss";
import "./style-mobile.scss";

import { FC, useEffect } from "react";
import { Field, FieldArray, Formik } from "formik";
import { useAddDoc, useFetchFirebase, useUpdateDoc } from "../../utils/hooks";

import Button from "../Button";
import { Button_Style } from "../Button/Button.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "../Input";
import Modal from "../Modal/Modal";
import { ModalEditQuestionProps } from "./ModalEditQuestion.types";
import SelectAnswerType from "../SelectAnswerType";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const ModalEditQuestion: FC<ModalEditQuestionProps> = ({
  isOpen,
  question,
  setIsOpen,
  setSelectQuestion,
}) => {
  const { handleAdd } = useAddDoc("questions");
  const { handleUpdate, error } = useUpdateDoc({
    docId: question?.id || "",
    collectionName: "questions",
  });
  const handleAnswerChange = (
    index: number,
    answerType: string,
    answer: any
  ) => {
    let newAnswer = answer;
    if (answerType === "M") {
      newAnswer?.includes(index)
        ? newAnswer.splice(newAnswer.indexOf(index), 1)
        : Array.isArray(newAnswer)
        ? newAnswer.push(index)
        : (newAnswer = [index]);
    } else {
      newAnswer = index;
    }
    return newAnswer;
  };

  return (
    <div className="ModalEditQuestion">
      <Formik
        enableReinitialize={true}
        initialValues={
          question || {
            title: "",
            answers: [],
            feedback: "",
            answerType: "TF",
            answer: null,
            comments: [],
            isFlagged: false,
          }
        }
        onSubmit={(values) => {
          question?.id ? handleUpdate(values) : handleAdd(values);
          setSelectQuestion && setSelectQuestion({} as any);

          setIsOpen(false);
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <Modal
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false);
              setSelectQuestion && setSelectQuestion({} as any);
            }}
            setIsClosed={() => {}}
            title="Edit question"
            labelOnConfirm="Save"
            onConfirm={() => handleSubmit()}
          >
            <form onSubmit={handleSubmit}>
              <div className="d-flex gap-05 mb-2">
                <Field
                  component={SelectAnswerType}
                  name="answerType"
                  value={"TF"}
                  onChange={handleChange}
                  label="True/False"
                  id="TF"
                />
                <Field
                  component={SelectAnswerType}
                  name="answerType"
                  value={"S"}
                  onChange={handleChange}
                  label="Single choice"
                  id="S"
                />
                <Field
                  component={SelectAnswerType}
                  name="answerType"
                  value={"M"}
                  onChange={handleChange}
                  label="Multiple choice"
                  id="M"
                />
              </div>
              <Input
                type="textarea"
                id="title"
                name="title"
                placeholder="Title"
                value={values.title}
                onChange={handleChange}
              />
              <div className="mb-2">
                <h4>Answers</h4>
                {values.answerType !== "TF" ? (
                  <FieldArray name="answers">
                    {({ push, remove }) => (
                      <div>
                        {values?.answers?.map((answer, index) => (
                          <div
                            key={index}
                            className={`answer ${
                              values.answer === index ||
                              (Array.isArray(values.answer) &&
                                values.answer.includes(index))
                                ? "bg-success"
                                : ""
                            }`}
                          >
                            <Field
                              type={
                                values.answerType === "M" ? "checkbox" : "radio"
                              }
                              name="answer"
                              value={index}
                              onChange={() => {
                                handleChange({
                                  target: {
                                    name: "answer",
                                    value: handleAnswerChange(
                                      index,
                                      values.answerType,
                                      values.answer
                                    ),
                                  },
                                });
                              }}
                            />

                            <div style={{ flex: 1 }}>
                              <Input
                                type="text"
                                id={`answers.${index}`}
                                name={`answers.${index}`}
                                placeholder={`Answer ${index + 1}`}
                                value={answer}
                                onChange={handleChange}
                              />
                            </div>
                            <Button
                              style={Button_Style.OUTLINED}
                              onClick={() => remove(index)}
                              isIconButton
                              icon={<FontAwesomeIcon icon={faTrash} />}
                              className="mb-05"
                            />
                          </div>
                        ))}
                        <Button
                          style={Button_Style.OUTLINED}
                          onClick={() => push("")}
                          icon={<FontAwesomeIcon icon={faPlus} />}
                          label="Add answer"
                        />
                      </div>
                    )}
                  </FieldArray>
                ) : (
                  <div className="d-flex gap-05">
                    <div
                      className={`answer ${
                        values.answer === true ? "bg-success" : ""
                      }`}
                    >
                      <label>
                        <Field
                          type="radio"
                          name="answer"
                          value={true}
                          onChange={() => {
                            handleChange({
                              target: {
                                name: "answer",
                                value: true,
                              },
                            });
                          }}
                        />{" "}
                        True
                      </label>
                    </div>
                    <div
                      className={`answer ${
                        values.answer === false ? "bg-success" : ""
                      }`}
                    >
                      <label>
                        <Field
                          type="radio"
                          name="answer"
                          value={false}
                          onChange={() => {
                            handleChange({
                              target: {
                                name: "answer",
                                value: false,
                              },
                            });
                          }}
                        />{" "}
                        False
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <Input
                type="textarea"
                id="feedback"
                name="feedback"
                placeholder="Feedback"
                value={values.feedback}
                onChange={handleChange}
              />
              <h4>Comments</h4>
              <label htmlFor="">
                <Field
                  label="Reported"
                  type="checkbox"
                  name="isFlagged"
                  checked={values?.isFlagged}
                  onChange={handleChange}
                />
                Reported
              </label>

              <FieldArray name="comments">
                {({ push, remove }) => (
                  <div>
                    {values?.comments?.map((comment, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between comment"
                      >
                        {comment}
                        <Button
                          style={Button_Style.OUTLINED}
                          onClick={() => remove(index)}
                          isIconButton
                          icon={<FontAwesomeIcon icon={faTrash} />}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </FieldArray>
            </form>
          </Modal>
        )}
      </Formik>
    </div>
  );
};

export default ModalEditQuestion;