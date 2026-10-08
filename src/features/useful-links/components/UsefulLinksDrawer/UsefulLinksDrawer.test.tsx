import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";
import { UsefulLinksDrawer } from "./UsefulLinksDrawer";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";

const modules = vi.hoisted(() => ({
  current: [] as Array<Record<string, unknown>>,
}));
vi.mock("../../../admin/hooks/useModules", () => ({
  useModules: () => ({ modules: modules.current }),
}));
vi.mock("../../../../utils/helpers/formationLabel", () => ({
  getFormationLabel: () => "PSPO I",
}));

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <UsefulLinksDrawer />
    </MemoryRouter>,
  );

describe("UsefulLinksDrawer", () => {
  beforeEach(() => {
    useQuestionsStore.setState({ formation: "pspo-I" });
  });

  it("renders nothing when the module has no useful links", () => {
    modules.current = [{ id: "1", title: "PSPO I", usefulLinks: null }];
    renderAt("/quizz");
    expect(document.getElementById("useful-links-tab")).toBeNull();
  });

  it("renders the tab when the module has useful links, on home and quiz pages", () => {
    modules.current = [{ id: "1", title: "PSPO I", usefulLinks: "<p>Hi</p>" }];
    renderAt("/quizz");
    expect(screen.getByText("Links")).toBeInTheDocument();
  });

  it("renders nothing outside home and quiz pages", () => {
    modules.current = [{ id: "1", title: "PSPO I", usefulLinks: "<p>Hi</p>" }];
    renderAt("/admin/modules");
    expect(document.getElementById("useful-links-tab")).toBeNull();
  });

  it("opens the drawer with the formatted content and sanitizes it", () => {
    modules.current = [
      {
        id: "1",
        title: "PSPO I",
        usefulLinks:
          '<p><strong>Guide</strong> <a href="https://scrum.org" target="_blank">Scrum</a><script>alert(1)</script></p>',
      },
    ];
    renderAt("/");
    fireEvent.click(document.getElementById("useful-links-tab")!);
    const link = screen.getByRole("link", { name: "Scrum" });
    expect(link).toHaveAttribute("href", "https://scrum.org");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(document.querySelector("script")).toBeNull();
  });
});
