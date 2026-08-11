"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "./data/db";
import { Organization } from "./types";

import { User } from "./types";

interface WorkspaceContextType {
  activeOrganization: Organization | undefined;
  currentUser: User | undefined;
  setActiveOrganizationId: (id: string) => void;
  logout: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(() => db.getState());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const unsubscribe = db.subscribe(() => {
      setState(db.getState());
    });
    return () => {
      unsubscribe();
    };
  }, [db]);

  const activeOrganization = state.organizations.find((org) => org.id === state.activeOrganizationId) || state.organizations[0];
  const currentUser = state.users.find((u) => u.id === state.activeUserId);

  if (!isMounted) {
    // Avoid hydration mismatch on first render
    return null;
  }

  return (
    <WorkspaceContext.Provider value={{ 
      activeOrganization, 
      currentUser,
      setActiveOrganizationId: (id) => db.setActiveWorkspace(id),
      logout: () => db.logout()
    }}>
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
