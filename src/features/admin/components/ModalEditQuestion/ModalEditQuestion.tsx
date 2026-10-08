import "./style.scss";
import "./style-mobile.scss";

import { Check, MessageSquarePlus, Pencil, Plus, Trash2 } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Field, FieldArray, Formik } from "formik";
import {
  getCommentDate,
  getCommentText,
} from "../../../../utils/helpers/comments";
import { useAddDoc, useUpdateDoc } from "../../../../utils/hooks";

import Button from "../../../../ui/Button/Button";
import { Button_Style } from "../../../../ui/Button/Button.types";
import Input from "../../../../ui/Input/Input";
import Modal from "../../../../ui/Modal/Modal";
import { ModalEditQuestionProps } from "./ModalEditQuestion.types";
import { QUESTIONS_COLLECTION } from "../../../../utils/constants";
import React from "react";
import RichTextEditor from "../../../../ui/RichTextEditor";
import SafeHtml from "../../../../ui/SafeHtml/SafeHtml";
import Select from "../../../../ui/Select/Select";
import SelectAnswerType from "../SelectAnswerType/SelectAnswerType";
import { getFormationValue } from "../../../../utils/helpers/formationLabel";
import { toast } from "react-toastify";
import { useModules } from "../../hooks/useModules";

const ModalEditQuestion: FC<ModalEditQuestionProps> = ({
  isOpen,
  question,
  setIsOpen,
  setSelectQuestion,
  defaultType,
}) => {
  const { handleAdd } = useAddDoc(QUESTIONS_COLLECTION);
  const { handleUpdate, error } = useUpdateDoc({
    docId: question?.id || "",
    collectionName: QUESTIONS_COLLECTION,
  });
  const { modules } = useModules();
  // RichTextEditor only reads its value on mount: bump this to remount the
  // per-answer editors when answers are removed and indices shift.
  const [explanationsVersion, setExplanationsVersion] = useState(0);
  // Answers whose feedback editor is expanded (collapsed by default to keep the form short).
  const [openFeedbacks, setOpenFeedbacks] = useState<number[]>([]);
  useEffect(() => {
    setOpenFeedbacks([]);
  }, [question?.id]);
  const toggleFeedback = (index: number) =>
    setOpenFeedbacks((open) =>
      open.includes(index) ? open.filter((i) => i !== index) : [...open, index],
    );
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
                answerExplanations: [],
                isFlagged: false,
                type: defaultType || "pspo-I",
              }
        }
        onSubmit={async (values) => {
          try {
            // A question is reported only while it still has comments.
            const payload = {
              ...values,
              isFlagged: (values.comments?.length ?? 0) > 0,
            };
            question?.id
              ? await handleUpdate(payload)
              : await handleAdd(payload);
            toast.success("Question updated successfully");
            setSelectQuestion && setSelectQuestion(undefined);
            setIsOpen(false);
          } catch (error) {
            console.error("Failed to update question", error);
            toast.error("Failed to update question");
          }
        }}
      >
        {({ values, handleChange, handleSubmit, setFieldValue }) => (
          <Modal
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false);
              setSelectQuestion && setSelectQuestion(undefined);
            }}
            setIsClosed={() => {}}
            title="Edit question"
            labelOnConfirm="Save"
            onConfirm={() => handleSubmit()}
          >
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-sm-3">
                  <h2 className="h6 mb-1">Module</h2>
                  <Field
                    as="select"
                    id="type"
                    name="type"
                    value={values.type}
                    onChange={handleChange}
                    className="select-modal"
                  >
                    {modules.map((module) => (
                      <option
                        key={module.id}
                        value={getFormationValue(module.title)}
                      >
                        {module.title}
                        {!module.isActive ? " (désactivé)" : ""}
                      </option>
                    ))}
                  </Field>
                </div>
                <div className="col-sm-9">
                  <h2 className="h6 mb-1">Answer Type</h2>
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
                <h2 className="mb-1 h4">Answers</h2>
                {values.answerType !== "TF" ? (
                  <FieldArray name="answers">
                    {({ push, remove }) => (
                      <div>
                        {values?.answers?.map((answer, index) => (
                          <React.Fragment key={index}>
                            <h5 className="mb-1">Answer {index + 1}</h5>
                            <div
                              className={`answer ${
                                values.answer === index ||
                                (Array.isArray(values.answer) &&
                                  values.answer.includes(index))
                                  ? "bg-success"
                                  : ""
                              }`}
                            >
                              <div className="answer-content">
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
                                                values.answer,
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
                                  onClick={() => {
                                    remove(index);
                                    setFieldValue(
                                      "answerExplanations",
                                      (values.answerExplanations ?? []).filter(
                                        (_, i) => i !== index,
                                      ),
                                    );
                                    setExplanationsVersion((v) => v + 1);
                                    setOpenFeedbacks((open) =>
                                      open
                                        .filter((i) => i !== index)
                                        .map((i) => (i > index ? i - 1 : i)),
                                    );
                                  }}
                                  isIconButton
                                  icon={<Trash2 size={16} />}
                                  className="mb-05"
                                />
                              </div>

                              <div className="answer-feedback answer-feedback--row">
                                <div className="answer-feedback__content">
                                  {openFeedbacks.includes(index) ? (
                                    <>
                                      <label className="answer-feedback__label">
                                        Feedback answer {index + 1}
                                      </label>
                                      <RichTextEditor
                                        key={`${question?.id ?? "new"}-${index}-${explanationsVersion}`}
                                        value={
                                          values.answerExplanations?.[index] ??
                                          ""
                                        }
                                        onChange={(html) =>
                                          setFieldValue(
                                            `answerExplanations.${index}`,
                                            html,
                                          )
                                        }
                                        placeholder={`Feedback de la réponse ${index + 1}`}
                                      />
                                    </>
                                  ) : values.answerExplanations?.[
                                      index
                                    ]?.trim() ? (
                                    <SafeHtml
                                      className="answer-feedback__text text-muted"
                                      html={values.answerExplanations[index]}
                                    />
                                  ) : (
                                    <span className="answer-feedback__text answer-feedback__text--empty">
                                      No feedback
                                    </span>
                                  )}
                                </div>
                                <Button
                                  buttonType="button"
                                  style={Button_Style.OUTLINED}
                                  size="S"
                                  onClick={() => toggleFeedback(index)}
                                  icon={
                                    openFeedbacks.includes(index) ? (
                                      <Check size={14} />
                                    ) : values.answerExplanations?.[
                                        index
                                      ]?.trim() ? (
                                      <Pencil size={14} />
                                    ) : (
                                      <MessageSquarePlus size={14} />
                                    )
                                  }
                                  label={
                                    openFeedbacks.includes(index)
                                      ? "Done"
                                      : values.answerExplanations?.[
                                            index
                                          ]?.trim()
                                        ? "Edit feedback"
                                        : "Add feedback"
                                  }
                                />
                              </div>
                            </div>
                          </React.Fragment>
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
                {values.answerType === "TF" && (
                  <>
                    {["True", "False"].map((label, index) => (
                      <div className="answer-feedback" key={label}>
                        <label className="answer-feedback__label">
                          Feedback — {label}
                        </label>
                        <RichTextEditor
                          key={`${question?.id ?? "new"}-tf-${index}`}
                          value={values.answerExplanations?.[index] ?? ""}
                          onChange={(html) =>
                            setFieldValue(`answerExplanations.${index}`, html)
                          }
                          placeholder={`Feedback — ${label}`}
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div className="question-feedback">
                <label className="answer-feedback__label" htmlFor="feedback">
                  Feedback (General)
                </label>
                <RichTextEditor
                  key={`${question?.id ?? "new"}-feedback`}
                  id="feedback"
                  value={values.feedback ?? ""}
                  onChange={(html) => setFieldValue("feedback", html)}
                  placeholder="Feedback"
                />
              </div>
              {(values.comments?.length ?? 0) > 0 && (
                <>
                  <h2 className="mb-1 h4">Comments</h2>
                  <FieldArray name="comments">
                    {({ push, remove }) => (
                      <div>
                        {values?.comments?.map((comment, index) => {
                          const date = getCommentDate(comment);
                          return (
                            <div
                              key={index}
                              className="d-flex justify-content-between comment"
                            >
                              <div>
                                {getCommentText(comment)}
                                {date && (
                                  <small className="comment__date d-block text-muted">
                                    {date}
                                  </small>
                                )}
                              </div>
                              <Button
                                style={Button_Style.OUTLINED}
                                onClick={() => remove(index)}
                                isIconButton
                                icon={<Trash2 size={16} />}
                              />
                            </div>
                          );
                        })}
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
