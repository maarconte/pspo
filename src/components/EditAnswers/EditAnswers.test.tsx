import { fireEvent, render, screen } from "@testing-library/react";

import EditAnswers from "./EditAnswers";
import React from "react";

describe("EditAnswers", () => {
  it("should render the component correctly", () => {
    const answerType = "M";
    const answers = ["Value 1", "Value 2", "Value 3"];
    render(<EditAnswers answerType={answerType} answers={answers} />);

    expect(screen.getByText("EditAnswers")).toBeInTheDocument();
  });

  // ... tests supplémentaires pour les props et les fonctionnalités du composant ...
});
