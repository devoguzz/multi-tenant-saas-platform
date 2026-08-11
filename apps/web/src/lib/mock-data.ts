import { Organization, User, Project, Task, Activity } from "./types";

export const mockOrganizations: Organization[] = [
  { id: "org_1", name: "Northstar Studio", slug: "northstar", plan: "PRO" },
  { id: "org_2", name: "Meridian Labs", slug: "meridian", plan: "ENTERPRISE" },
];

export const mockUsers: User[] = [
  { id: "usr_1", name: "Alice Freeman", email: "alice@northstar.co", role: "ADMIN", organizationId: "org_1", status: "ONLINE" },
  { id: "usr_2", name: "Bob Smith", email: "bob@northstar.co", role: "MEMBER", organizationId: "org_1", status: "BUSY" },
  { id: "usr_3", name: "Charlie Davis", email: "charlie@meridian.io", role: "ADMIN", organizationId: "org_2", status: "ONLINE" },
  { id: "usr_4", name: "Diana Prince", email: "diana@meridian.io", role: "MEMBER", organizationId: "org_2", status: "OFFLINE" },
];

export const mockCurrentUser = mockUsers[0];

export const mockProjects: Project[] = [
  { id: "prj_1", name: "Website Redesign", client: "Acme Corp", status: "ACTIVE", progress: 65, dueDate: "2026-09-01", organizationId: "org_1" },
  { id: "prj_2", name: "Mobile App MVP", client: "Globex", status: "PLANNING", progress: 10, dueDate: "2026-10-15", organizationId: "org_1" },
  { id: "prj_3", name: "Marketing Campaign", client: "Initech", status: "COMPLETED", progress: 100, dueDate: "2026-08-01", organizationId: "org_1" },
  { id: "prj_4", name: "Data Migration", client: "Umbrella Corp", status: "ACTIVE", progress: 40, dueDate: "2026-09-20", organizationId: "org_2" },
];

export const mockTasks: Task[] = [
  { id: "tsk_1", title: "Design homepage hero section", projectId: "prj_1", assigneeId: "usr_1", priority: "HIGH", status: "IN_PROGRESS", dueDate: "2026-08-15", organizationId: "org_1" },
  { id: "tsk_2", title: "Fix navigation bug on mobile", projectId: "prj_1", assigneeId: "usr_2", priority: "URGENT", status: "TODO", dueDate: "2026-08-12", organizationId: "org_1" },
  { id: "tsk_3", title: "Write API specifications", projectId: "prj_2", assigneeId: "usr_1", priority: "MEDIUM", status: "TODO", dueDate: "2026-08-20", organizationId: "org_1" },
  { id: "tsk_4", title: "Setup staging environment", projectId: "prj_4", assigneeId: "usr_3", priority: "HIGH", status: "IN_PROGRESS", dueDate: "2026-08-14", organizationId: "org_2" },
];

export const mockActivities: Activity[] = [
  { id: "act_1", type: "TASK_STATUS_CHANGED", description: "moved 'Design homepage hero section' to In Progress", userId: "usr_1", createdAt: "2026-08-11T10:00:00Z", organizationId: "org_1" },
  { id: "act_2", type: "PROJECT_CREATED", description: "created project 'Mobile App MVP'", userId: "usr_1", createdAt: "2026-08-10T14:30:00Z", organizationId: "org_1" },
  { id: "act_3", type: "MEMBER_INVITED", description: "invited Bob Smith to the workspace", userId: "usr_1", createdAt: "2026-08-09T09:15:00Z", organizationId: "org_1" },
  { id: "act_4", type: "TASK_COMPLETED", description: "completed 'Review Q3 strategy'", userId: "usr_2", createdAt: "2026-08-08T16:45:00Z", organizationId: "org_1" },
];

export function getMockData(organizationId: string) {
  return {
    organization: mockOrganizations.find((org) => org.id === organizationId),
    users: mockUsers.filter((user) => user.organizationId === organizationId),
    projects: mockProjects.filter((project) => project.organizationId === organizationId),
    tasks: mockTasks.filter((task) => task.organizationId === organizationId),
    activities: mockActivities.filter((activity) => activity.organizationId === organizationId),
  };
}
