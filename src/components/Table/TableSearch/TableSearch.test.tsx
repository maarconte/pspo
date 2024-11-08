import { fireEvent, render, screen } from "@testing-library/react";

import React from "react";
import TableSearch from "./TableSearch";

describe("TableSearch", () => {
  it("should render the component correctly", () => {
    render(<TableSearch value="" onChange={() => {}} />);

    expect(screen.getByText("TableSearch")).toBeInTheDocument();
  });

  // ... tests supplémentaires pour les props et les fonctionnalités du composant ...
});
