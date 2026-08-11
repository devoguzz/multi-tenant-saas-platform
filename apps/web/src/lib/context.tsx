"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { mockOrganizations } from "./mock-data";
import { Organization } from "./types";

interface WorkspaceContextType {
  activeOrganization: Organization;
  setActiveOrganizationId: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [activeOrgId, setActiveOrgId] = useState(mockOrganizations[0].id);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activeOrganization = mockOrganizations.find((org) => org.id === activeOrgId) || mockOrganizations[0];

  if (!isMounted) {
    // Avoid hydration mismatch on first render
    return null;
  }

  return (
    <WorkspaceContext.Provider value={{ activeOrganization, setActiveOrganizationId: setActiveOrgId }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
