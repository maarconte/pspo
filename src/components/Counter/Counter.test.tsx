import { fireEvent, render, screen } from "@testing-library/react";

import Counter from "./Counter";
import React from "react";

describe("Counter", () => {
  it("should render the component correctly", () => {
    const setIsPaused = jest.fn();
    const finishQuizz = jest.fn();
    render(
      <Counter
        isPaused={false}
        setIsPaused={setIsPaused}
        finishQuizz={finishQuizz}
      />
    );

    expect(screen.getByText("Counter")).toBeInTheDocument();
  });

  // ... tests supplémentaires pour les props et les fonctionnalités du composant ...
});
