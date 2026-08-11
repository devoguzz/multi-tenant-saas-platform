export type UserRole = "ADMIN" | "MEMBER" | "GUEST";
export type ProjectStatus = "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
export type ActivityType = "PROJECT_CREATED" | "TASK_COMPLETED" | "MEMBER_INVITED" | "TASK_STATUS_CHANGED";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: "FREE" | "PRO" | "ENTERPRISE";
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  organizationId: string;
  status: "ONLINE" | "OFFLINE" | "BUSY";
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  progress: number;
  dueDate: string;
  organizationId: string;
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  assigneeId: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  organizationId: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  userId: string;
  createdAt: string;
  organizationId: string;
}
