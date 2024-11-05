import { fireEvent, render, screen } from "@testing-library/react";

import React from "react";
import Table from "./Table";

describe("Table", () => {
  it("should render the component correctly", () => {
    const data: any = [];
    const columns: any = [];

    render(<Table data={data} columns={columns} />);

    expect(screen.getByText("Table")).toBeInTheDocument();
  });

  // ... tests supplémentaires pour les props et les fonctionnalités du composant ...
});
