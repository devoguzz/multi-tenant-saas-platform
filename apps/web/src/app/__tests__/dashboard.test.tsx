import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardPage from "../(dashboard)/dashboard/page";
import { WorkspaceProvider } from "../../lib/context";

describe("Dashboard Page", () => {
  it("renders dashboard KPI metrics from mock data", () => {
    render(
      <WorkspaceProvider>
        <DashboardPage />
      </WorkspaceProvider>
    );

    // Assert that metric labels are present
    expect(screen.getByText("Active Projects")).toBeInTheDocument();
    expect(screen.getByText("Open Tasks")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Overdue")).toBeInTheDocument();
    
    // Check if the mock projects are rendered
    expect(screen.getByText("Website Redesign")).toBeInTheDocument();
    
    // Check if team members are rendered
    expect(screen.getAllByText("Alice Freeman").length).toBeGreaterThan(0);
  });
});
