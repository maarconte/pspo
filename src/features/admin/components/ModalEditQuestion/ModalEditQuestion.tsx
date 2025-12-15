import "./style.scss";
import "./style-mobile.scss";

import { FC, useEffect } from "react";
import { Trash2, Plus } from "lucide-react";
import { Field, FieldArray, Formik } from "formik";
import { useAddDoc, useUpdateDoc } from "../../../../utils/hooks";

import Button from "../../../../ui/Button/Button";
import { Button_Style } from "../../../../ui/Button/Button.types";
import Input from "../../../../ui/Input/Input";
import Modal from "../../../../ui/Modal/Modal";
import { ModalEditQuestionProps } from "./ModalEditQuestion.types";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";
import React from "react";
import Select from "../../../../ui/Select/Select";
import SelectAnswerType from "../SelectAnswerType/SelectAnswerType";

const ModalEditQuestion: FC<ModalEditQuestionProps> = ({
  isOpen,
  question,
  setIsOpen,
  setSelectQuestion,
}) => {
  const { refetch } = useQuestionsStore();
  const { handleAdd } = useAddDoc("questions");
  const { handleUpdate, error } = useUpdateDoc({
    docId: question?.id || "",
    collectionName: "questions",
  });
  const handleAnswerChange = (index: number, answer: any) => {
    let newAnswer = Array.isArray(answer) ? [...answer] : [];
    newAnswer?.includes(index)
      ? newAnswer.splice(newAnswer.indexOf(index), 1)
      : Array.isArray(newAnswer)
      ? newAnswer.push(index)
      : (newAnswer = [index]);

    return newAnswer;
  };

  return (
    <div className="ModalEditQuestion">
      <Formik
        enableReinitialize={true}
        initialValues={
          question
            ? question
            : {
                title: "",
                answers: [],
                feedback: "",
                answerType: "",
                answer: null,
                comments: [],
                isFlagged: false,
                type: "pspo-I",
              }
        }
        onSubmit={(values) => {
          refetch();
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
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-1">Formation</h6>
                  <Field
                    as="select"
                    id="type"
                    name="type"
                    value={values.type}
                    onChange={handleChange}
                    className="select-modal"
                  >
                    <option value="pspo-I">pspo-I</option>
                    <option value="psm-I">psm-I</option>
                  </Field>
                </div>
                <div className="col-sm-9">
                  <h6 className="mb-1">Type de réponse</h6>
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
                </div>
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
                          <>
                            <h5 className="mb-1">Answer {index + 1}</h5>
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
                                  values.answerType === "M"
                                    ? "checkbox"
                                    : "radio"
                                }
                                name="answer"
                                id={`answer-${index}`}
                                value={index}
                                onChange={() => {
                                  handleChange({
                                    target: {
                                      name: "answer",
                                      value:
                                        values.answerType === "M"
                                          ? handleAnswerChange(
                                              index,
                                              values.answer
                                            )
                                          : index,
                                    },
                                  });
                                }}
                              />

                              <label htmlFor={`answer-${index}`}>
                                <div style={{ flex: 1 }}>
                                  <Input
                                    type="text"
                                    id={`answers.${index}`}
                                    name={`answers.${index}`}
                                    //  placeholder={`Answer ${index + 1}`}
                                    value={answer}
                                    onChange={handleChange}
                                  />
                                </div>
                              </label>

                              <Button
                                style={Button_Style.OUTLINED}
                                onClick={() => remove(index)}
                                isIconButton
                                icon={<Trash2 size={16} />}
                                className="mb-05"
                              />
                            </div>
                          </>
                        ))}
                        <Button
                          style={Button_Style.OUTLINED}
                          onClick={() => push("")}
                          icon={<Plus size={16} />}
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
                name={"feedback"}
                placeholder="Feedback"
                value={values.feedback}
                onChange={handleChange}
              />
              {values.isFlagged && (
                <>
                  <h4>Comments</h4>
                  <div
                    className={`reportedCheckbox ${
                      values.isFlagged ? "selected" : ""
                    }`}
                  >
                    <Field
                      label="Reported"
                      type="checkbox"
                      name="isFlagged"
                      id="isFlagged"
                      checked={values?.isFlagged}
                      onChange={handleChange}
                    />
                    <label htmlFor="isFlagged">Reported</label>
                  </div>
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
                              icon={<Trash2 size={16} />}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>
                </>
              )}
            </form>
          </Modal>
        )}
      </Formik>
    </div>
  );
};

export default ModalEditQuestion;
