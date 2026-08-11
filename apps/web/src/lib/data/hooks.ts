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
    return {
      organization: state.organizations.find(o => o.id === orgId),
      users: state.users.filter(u => u.organizationId === orgId),
      clients: state.clients.filter(c => c.organizationId === orgId),
      projects: state.projects.filter(p => p.organizationId === orgId),
      tasks: state.tasks.filter(t => t.organizationId === orgId),
      activities: state.activities.filter(a => a.organizationId === orgId),
      notifications: (state.notifications || []).filter(n => n.organizationId === orgId && n.userId === state.activeUserId),
    };
  }, [state, activeOrganization]);
}
