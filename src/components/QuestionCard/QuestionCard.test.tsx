import { fireEvent, render, screen } from "@testing-library/react";

import QuestionCard from "./QuestionCard";
import React from "react";

describe("QuestionCard", () => {
  it("should render the component correctly", () => {
    const question = {
      title: "Question title",
      feedback: "Question feedback",
      answers: ["Answer 1", "Answer 2", "Answer 3"],
      answerType: "single",
      answer: 1,
      id: "1",
    };
    render(
      <QuestionCard
        question={question}
        currentQuestion={1}
        showAnswer={false}
      />
    );
    expect(screen.getByText("QuestionCard")).toBeInTheDocument();
  });

  it("should render the question title", () => {
    const question = {
      title: "Question title",
      feedback: "Question feedback",
      answers: ["Answer 1", "Answer 2", "Answer 3"],
      answerType: "single",
      answer: 1,
      id: "1",
    };
    render(
      <QuestionCard
        question={question}
        currentQuestion={1}
        showAnswer={false}
      />
    );
    expect(screen.getByText("Question title")).toBeInTheDocument();
  });

  it("should render the answers", () => {
    const question = {
      title: "Question title",
      feedback: "Question feedback",
      answers: ["Answer 1", "Answer 2", "Answer 3"],
      answerType: "single",
      answer: 1,
      id: "1",
    };
    render(
      <QuestionCard
        question={question}
        currentQuestion={1}
        showAnswer={false}
      />
    );
    expect(screen.getByText("Answer 1")).toBeInTheDocument();
    expect(screen.getByText("Answer 2")).toBeInTheDocument();
    expect(screen.getByText("Answer 3")).toBeInTheDocument();
  });

  it("should render the feedback when showAnswer is true", () => {
    const question = {
      title: "Question title",
      feedback: "Question feedback",
      answers: ["Answer 1", "Answer 2", "Answer 3"],
      answerType: "single",
      answer: 1,
      id: "1",
    };
    render(
      <QuestionCard question={question} currentQuestion={1} showAnswer={true} />
    );
    expect(screen.getByText("Question feedback")).toBeInTheDocument();
  });
});
