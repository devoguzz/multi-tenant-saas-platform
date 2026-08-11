import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AppSidebar } from "../../components/layout/app-sidebar";
import { WorkspaceSwitcher } from "../../components/layout/workspace-switcher";
import { WorkspaceProvider } from "../../lib/context";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

describe("Navigation & Layout", () => {
  it("renders sidebar navigation links", () => {
    render(
      <WorkspaceProvider>
        <AppSidebar mobileOpen={false} setMobileOpen={jest.fn()} />
      </WorkspaceProvider>
    );
    
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Tasks")).toBeInTheDocument();
    expect(screen.getByText("Team")).toBeInTheDocument();
  });

  it("handles workspace switcher behavior", () => {
    render(
      <WorkspaceProvider>
        <WorkspaceSwitcher />
      </WorkspaceProvider>
    );
    
    // Initially shows Northstar Studio
    expect(screen.getByText("Northstar Studio")).toBeInTheDocument();
    
    // Open dropdown
    const button = screen.getByRole("button", { name: /Northstar Studio/i });
    fireEvent.click(button);
    
    // Both orgs should be visible in the dropdown
    expect(screen.getByText("Meridian Labs")).toBeInTheDocument();
  });
});
