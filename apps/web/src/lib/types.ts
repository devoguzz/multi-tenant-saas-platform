export type UserRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
export type ProjectStatus = "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
export type ActivityType = 
  | "CLIENT_CREATED" 
  | "CLIENT_EDITED" 
  | "PROJECT_CREATED" 
  | "PROJECT_EDITED" 
  | "TASK_CREATED" 
  | "TASK_STATUS_CHANGED" 
  | "TASK_COMPLETED" 
  | "MEMBER_INVITED" 
  | "MEMBER_ROLE_CHANGED"
  | "WORKSPACE_CREATED";

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

export interface Client {
  id: string;
  name: string;
  website: string;
  industry: string;
  status: "ACTIVE" | "INACTIVE";
  organizationId: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string | null;
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

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
  organizationId: string;
  userId: string;
}
