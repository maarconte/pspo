import { fireEvent, render, screen } from "@testing-library/react";

import React from "react";
import Select from "./Select";

describe("Select", () => {
  it("should render the component correctly", () => {
    const options = [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
    ];
    render(<Select options={options} />);

    expect(screen.getByText("Select")).toBeInTheDocument();
  });

  // ... tests supplémentaires pour les props et les fonctionnalités du composant ...
});
