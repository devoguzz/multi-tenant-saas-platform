import { useSyncExternalStore, useMemo } from "react";
import { db } from "./db";
import { useWorkspace } from "../context";

export function useDB() {
  const state = useSyncExternalStore(
    (listener) => db.subscribe(listener),
    () => db.getState(),
    () => db.getState() // fallback for SSR, though we generally only use this client-side
  );

  return { state, db };
}

export function useOrganizationData() {
  const { activeOrganization } = useWorkspace();
  const { state } = useDB();

  return useMemo(() => {
    if (!activeOrganization) return null;
    const orgId = activeOrganization.id;
    const orgTasks = state.tasks.filter(t => t.organizationId === orgId);
    
    const orgProjects = state.projects.filter(p => p.organizationId === orgId).map(p => {
      const pTasks = orgTasks.filter(t => t.projectId === p.id);
      const pCompleted = pTasks.filter(t => t.status === "DONE").length;
      return {
        ...p,
        progress: pTasks.length === 0 ? 0 : Math.round((pCompleted / pTasks.length) * 100),
      };
    });

    return {
      organization: activeOrganization,
      users: state.users.filter(u => u.organizationId === orgId),
      clients: state.clients.filter(c => c.organizationId === orgId),
      projects: orgProjects,
      tasks: orgTasks,
      activities: state.activities.filter(a => a.organizationId === orgId),
      notifications: (state.notifications || []).filter(n => n.organizationId === orgId && n.userId === state.activeUserId),
    };
  }, [state, activeOrganization]);
}
