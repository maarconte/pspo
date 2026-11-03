import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import type { Module } from "../../types/module.types";
import { ModuleFormModal } from "./ModuleFormModal";

vi.mock("../../api/modules.api", () => ({
  createModule: vi.fn(),
  updateModule: vi.fn(),
}));

const module = {
  id: "m1",
  title: "PSPO I",
  isActive: true,
  quizDuration: "01:00",
  questionCount: 80,
  minSuccessPercent: 85,
  usefulLinks: '<p>Guide <a href="https://scrum.org">Scrum</a></p>',
} as Module;

describe("ModuleFormModal useful links", () => {
  it("shows the previously saved useful links in the editor when editing", async () => {
    render(<ModuleFormModal isOpen onClose={() => {}} module={module} />);
    expect(await screen.findByText("Scrum")).toBeInTheDocument();
  });

  it("starts with an empty editor when adding a module", async () => {
    render(<ModuleFormModal isOpen onClose={() => {}} />);
    const editor = await screen.findByLabelText("Links du module", {
      selector: "[contenteditable]",
    });
    expect(editor.textContent).toBe("");
  });
});

describe("ModuleFormModal switching modules", () => {
  it("shows the useful links of the newly opened module, not the previous one", async () => {
    const other = {
      ...module,
      id: "m2",
      title: "PSM I",
      usefulLinks: "<p>Autre module</p>",
    } as Module;
    const { rerender } = render(
      <ModuleFormModal isOpen onClose={() => {}} module={module} />,
    );
    expect(await screen.findByText("Scrum")).toBeInTheDocument();

    rerender(<ModuleFormModal isOpen={false} onClose={() => {}} />);
    rerender(<ModuleFormModal isOpen onClose={() => {}} module={other} />);

    expect(await screen.findByText("Autre module")).toBeInTheDocument();
    expect(screen.queryByText("Scrum")).toBeNull();
  });
});

describe("ModuleFormModal domain percentages", () => {
  const withDomains = { ...module, domains: ["Domaine A", "Domaine B", "Domaine C"] } as Module;
  const field = (name: string) => screen.getByLabelText(name) as HTMLInputElement;
  const type = (name: string, value: string) =>
    fireEvent.change(field(name), { target: { value } });
  const saveButton = () => screen.getByRole("button", { name: "Save" });

  it("shows the running total and keeps Save enabled when valid (scenario 1)", () => {
    render(<ModuleFormModal isOpen onClose={() => {}} module={withDomains} />);

    type("Domaine A", "40");
    type("Domaine B", "50");

    expect(
      screen.getByText("Total configuré : 90% (10% restants pour les questions sans domaine)"),
    ).toBeInTheDocument();
    expect(saveButton()).toBeEnabled();
  });

  it("blocks saving and shows an error when the total exceeds 100% (scenario 2)", () => {
    render(<ModuleFormModal isOpen onClose={() => {}} module={withDomains} />);

    type("Domaine A", "60");
    type("Domaine B", "50");

    expect(screen.getByText("Total configuré : 110%")).toBeInTheDocument();
    expect(screen.getByText("Le total ne peut pas dépasser 100%")).toBeInTheDocument();
    expect(saveButton()).toBeDisabled();
  });

  it("only accepts whole numbers (scenario 4)", () => {
    render(<ModuleFormModal isOpen onClose={() => {}} module={withDomains} />);

    type("Domaine A", "4,.-a2");
    expect(field("Domaine A").value).toBe("42");
  });

  it("auto-balances 100% across domains, giving the remainder to the first ones", () => {
    render(<ModuleFormModal isOpen onClose={() => {}} module={withDomains} />);

    fireEvent.click(screen.getByRole("button", { name: "Auto-équilibrer" }));

    expect(field("Domaine A").value).toBe("34");
    expect(field("Domaine B").value).toBe("33");
    expect(field("Domaine C").value).toBe("33");
    expect(screen.getByText(/Total configuré : 100%/)).toBeInTheDocument();
  });
});
