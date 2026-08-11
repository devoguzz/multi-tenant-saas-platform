import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { WorkspaceProvider, useWorkspace } from "../../lib/context";
import { WorkspaceSwitcher } from "../../components/layout/workspace-switcher";

// A dummy component to observe context changes
function ContextObserver() {
  const { activeOrganization } = useWorkspace();
  return <div data-testid="active-org">{activeOrganization?.name ?? "None"}</div>;
}

describe("Workspace Switcher", () => {
  it("switches workspace context", () => {
    render(
      <WorkspaceProvider>
        <WorkspaceSwitcher />
        <ContextObserver />
      </WorkspaceProvider>
    );

    // Initial state
    expect(screen.getByTestId("active-org")).toHaveTextContent("Northstar Studio");

    // Open switcher
    fireEvent.click(screen.getByRole("button", { name: /Northstar Studio/i }));
    
    // Click Meridian Labs
    fireEvent.click(screen.getByText("Meridian Labs"));

    // Verify context updated
    expect(screen.getByTestId("active-org")).toHaveTextContent("Meridian Labs");
  });
});
