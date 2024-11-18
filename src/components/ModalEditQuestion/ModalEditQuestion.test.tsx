import { fireEvent, render, screen } from "@testing-library/react";

import ModalEditQuestion from "./ModalEditQuestion";
import React from "react";

describe("ModalEditQuestion", () => {
  it("should render the component correctly", () => {
    const [isOpen, setIsOpen] = React.useState(true);
    const question = {
      title: "Question title",
      feedback: "Question feedback",
      answers: ["Answer 1", "Answer 2", "Answer 3"],
      answerType: "single",
      answer: 1,
      id: "1",
    };

    render(
      <ModalEditQuestion isOpen question={question} setIsOpen={setIsOpen} />
    );

    expect(screen.getByText("ModalEditQuestion")).toBeInTheDocument();
  });

  // ... tests supplémentaires pour les props et les fonctionnalités du composant ...
});
