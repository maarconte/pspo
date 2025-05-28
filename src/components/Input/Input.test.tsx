import { fireEvent, render, screen } from "@testing-library/react";

import Input from "./Input";
import React from "react";

describe("Input", () => {
  it("should render the component correctly", () => {
    render(<Input placeholder="iput" name="input" />);

    expect(screen.getByText("Input")).toBeInTheDocument();
  });

  // ... tests supplémentaires pour les props et les fonctionnalités du composant ...
});
