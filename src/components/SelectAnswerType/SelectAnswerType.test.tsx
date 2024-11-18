import { fireEvent, render, screen } from "@testing-library/react";

import React from "react";
import SelectAnswerType from "./SelectAnswerType";

describe("SelectAnswerType", () => {
  it("should render the component correctly", () => {
    const handleChange = jest.fn();
    render(
      <SelectAnswerType
        label="Label"
        id="label"
        field={{
          name: "name",
          value: "value",
          onChange: handleChange,
          onBlur: handleChange,
        }}
      />
    );

    expect(screen.getByText("SelectAnswerType")).toBeInTheDocument();
  });

  // ... tests supplémentaires pour les props et les fonctionnalités du composant ...
});
