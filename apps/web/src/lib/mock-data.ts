import { Organization, User, Project, Task, Activity, Client, Notification } from "./types";

export const mockOrganizations: Organization[] = [
  { id: "org_1", name: "Northstar Studio", slug: "northstar", plan: "PRO" },
  { id: "org_2", name: "Meridian Labs", slug: "meridian", plan: "ENTERPRISE" },
];

export const mockUsers: User[] = [
  {
    id: "usr_1",
    email: "alex@northstar.com",
    name: "Alex Rivera",
    role: "OWNER",
    organizationId: "org_1",
    status: "ONLINE",
  },
  {
    id: "usr_2",
    email: "sam@northstar.com",
    name: "Sam Chen",
    role: "ADMIN",
    organizationId: "org_1",
    status: "BUSY",
  },
  {
    id: "usr_3",
    email: "taylor@northstar.com",
    name: "Taylor Smith",
    role: "MEMBER",
    organizationId: "org_1",
    status: "OFFLINE",
  },
  {
    id: "usr_4",
    email: "jordan@northstar.com",
    name: "Jordan Lee",
    role: "VIEWER",
    organizationId: "org_1",
    status: "ONLINE",
  },
  {
    id: "usr_5",
    email: "casey@meridian.com",
    name: "Casey Jones",
    role: "OWNER",
    organizationId: "org_2",
    status: "ONLINE",
  }
];

export const mockCurrentUser = mockUsers[0];

export const mockNotifications: Notification[] = [
  { id: "notif_1", type: "mention", title: "New mention", message: "New comment on Website Redesign", read: false, link: "/projects/proj_1", organizationId: "org_1", userId: "usr_1", createdAt: "2026-08-12T09:00:00Z" },
  { id: "notif_2", type: "system", title: "Approval", message: "Your project was approved", read: true, link: "/projects/proj_2", organizationId: "org_1", userId: "usr_1", createdAt: "2026-08-11T16:00:00Z" },
];

export const mockClients: Client[] = [
  { id: "cli_1", name: "Acme Corp", website: "acme.com", industry: "Manufacturing", status: "ACTIVE", organizationId: "org_1" },
  { id: "cli_2", name: "Globex", website: "globex.com", industry: "Logistics", status: "ACTIVE", organizationId: "org_1" },
  { id: "cli_3", name: "Initech", website: "initech.com", industry: "Software", status: "INACTIVE", organizationId: "org_1" },
  { id: "cli_4", name: "Umbrella Corp", website: "umbrella.com", industry: "Biotech", status: "ACTIVE", organizationId: "org_2" },
];

export const mockProjects: Project[] = [
  { id: "prj_1", name: "Website Redesign", clientId: "cli_1", status: "ACTIVE", progress: 65, dueDate: "2026-09-01", organizationId: "org_1" },
  { id: "prj_2", name: "Mobile App MVP", clientId: "cli_2", status: "PLANNING", progress: 10, dueDate: "2026-10-15", organizationId: "org_1" },
  { id: "prj_3", name: "Marketing Campaign", clientId: "cli_3", status: "COMPLETED", progress: 100, dueDate: "2026-08-01", organizationId: "org_1" },
  { id: "prj_4", name: "Data Migration", clientId: "cli_4", status: "ACTIVE", progress: 40, dueDate: "2026-09-20", organizationId: "org_2" },
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
    clients: mockClients.filter((client) => client.organizationId === organizationId),
    projects: mockProjects.filter((project) => project.organizationId === organizationId),
    tasks: mockTasks.filter((task) => task.organizationId === organizationId),
    activities: mockActivities.filter((activity) => activity.organizationId === organizationId),
  };
}
