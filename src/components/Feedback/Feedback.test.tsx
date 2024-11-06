import { fireEvent, render, screen } from "@testing-library/react";

import Feedback from "./Feedback";
import React from "react";

describe("Feedback", () => {
  it("should render the component correctly", () => {
    const question = {
      title: "Question title",
      feedback: "Feedback",
      answers: ["Answer 1", "Answer 2"],
      answerType: "TF",
      answer: true,
      id: "1",
    };
    render(<Feedback question={question} />);

    expect(screen.getByText("Feedback")).toBeInTheDocument();
  });

  // ... tests supplémentaires pour les props et les fonctionnalités du composant ...
});
