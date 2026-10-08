import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import QuestionAnswer from "./QuestionAnswer";

const baseProps = {
  id: "",
  name: "answer-0",
  type: "radio" as const,
  label: "A framework",
  checked: false,
  onChange: () => {},
};

describe("QuestionAnswer feedback", () => {
  it("shows no info icon when the option has no feedback", () => {
    render(<QuestionAnswer {...baseProps} />);
    expect(screen.queryByRole("button", { name: /feedback/i })).not.toBeInTheDocument();
  });

  it("shows no info icon when the feedback is blank", () => {
    render(<QuestionAnswer {...baseProps} explanation="   " />);
    expect(screen.queryByRole("button", { name: /feedback/i })).not.toBeInTheDocument();
  });

  it("toggles the feedback under the option when clicking the info icon", () => {
    render(<QuestionAnswer {...baseProps} explanation="<b>Because</b> it is" />);

    const button = screen.getByRole("button", { name: "Afficher le feedback" });
    expect(screen.queryByText("Because")).not.toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByText("Because")).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(button);
    expect(screen.queryByText("Because")).not.toBeInTheDocument();
  });
});
