import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { CoopDrawer } from "./CoopDrawer";
import { useCoopStore } from "../../../../stores/useCoopStore";

// Mock rsuite components
vi.mock("rsuite", () => {
    const Drawer = ({ children, open, onClose }: any) => (
        open ? (
            <div data-testid="drawer">
                <button onClick={onClose} data-testid="close-drawer">Close</button>
                {children}
            </div>
        ) : null
    );
    Drawer.Header = ({ children }: any) => <div>{children}</div>;
    Drawer.Title = ({ children }: any) => <div>{children}</div>;
    Drawer.Body = ({ children }: any) => <div>{children}</div>;

    const Input = ({ value, onChange, onKeyPress, placeholder }: any) => (
        <input
            data-testid="coop-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder={placeholder}
        />
    );

    const List = ({ children }: any) => <div data-testid="coop-list">{children}</div>;
    List.Item = ({ children }: any) => <div data-testid="coop-item">{children}</div>;

    return { Drawer, Input, List };
});

describe("CoopDrawer Component", () => {
    beforeEach(() => {
        // Reset store state
        useCoopStore.setState({
            participants: [],
            currentIndex: 0,
            isOpen: false,
        });
    });

    it("renders the toggle tab with count 0 initially", () => {
        render(<CoopDrawer />);
        expect(screen.getByText("Mode coop")).toBeDefined();
        // Badge should not be visible if 0 participants
        expect(screen.queryByText("0")).toBeNull();
    });

    it("renders the badge when participants are present", () => {
        useCoopStore.setState({ participants: ["Alice", "Bob"] });
        render(<CoopDrawer />);
        expect(screen.getByText("2")).toBeDefined();
    });

    it("opens the drawer when clicking the tab", () => {
        render(<CoopDrawer />);
        const tab = screen.getByText("Mode coop").closest("div");
        fireEvent.click(tab!);

        expect(screen.getByTestId("drawer")).toBeDefined();
    });

    it("calls setOpen(false) when drawer is closed", () => {
        useCoopStore.setState({ isOpen: true });
        render(<CoopDrawer />);
        
        const closeBtn = screen.getByTestId("close-drawer");
        fireEvent.click(closeBtn);

        expect(useCoopStore.getState().isOpen).toBe(false);
    });

    it("adds a participant through input and button click", () => {
        useCoopStore.setState({ isOpen: true });
        render(<CoopDrawer />);

        const input = screen.getByTestId("coop-input");
        const addButton = screen.getByText("Ajouter");

        fireEvent.change(input, { target: { value: "Alice" } });
        fireEvent.click(addButton);

        expect(useCoopStore.getState().participants).toContain("Alice");
        expect((input as HTMLInputElement).value).toBe("");
    });

    it("adds a participant when pressing Enter", () => {
        useCoopStore.setState({ isOpen: true });
        render(<CoopDrawer />);

        const input = screen.getByTestId("coop-input");
        fireEvent.change(input, { target: { value: "Bob" } });
        
        // Use keyPress with charCode/keyCode for onKeyPress
        fireEvent.keyPress(input, { key: "Enter", keyCode: 13, charCode: 13 });

        expect(useCoopStore.getState().participants).toContain("Bob");
    });

    it("displays error message from store", () => {
      // Mock addParticipant to return an error
      const mockAdd = vi.fn().mockReturnValue({ success: false, error: "Mock Error" });
      const originalAdd = useCoopStore.getState().addParticipant;
      useCoopStore.setState({ addParticipant: mockAdd, isOpen: true });

      render(<CoopDrawer />);
      
      const input = screen.getByTestId("coop-input");
      const addButton = screen.getByText("Ajouter");

      fireEvent.change(input, { target: { value: "Wait" } });
      fireEvent.click(addButton);

      expect(screen.getByText("Mock Error")).toBeDefined();
      
      // Restore
      useCoopStore.setState({ addParticipant: originalAdd });
    });

    it("removes a participant via trash icon", () => {
        useCoopStore.setState({ isOpen: true, participants: ["Alice"] });
        render(<CoopDrawer />);

        // The trash icon is inside a button. Button has icon props.
        // We can find the button that contains Trash2 or just by finding the remove button.
        // In CoopDrawer.tsx, remove button has className="coop-drawer__remove-btn"
        // But since we use our custom Button UI, let's see how it renders.
        
        const removeBtns = screen.getAllByRole("button");
        // Filter to find the one that removes (it's the one with trash)
        // Or just the only button besides "Ajouter"
        const removeBtn = removeBtns.find(b => b.className.includes("remove-btn"));
        
        fireEvent.click(removeBtn!);

        expect(useCoopStore.getState().participants).not.toContain("Alice");
    });
});
