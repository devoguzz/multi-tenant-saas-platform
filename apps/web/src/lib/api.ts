import { getMockData } from "./mock-data";
import { Organization, User, Project, Task, Activity } from "./types";

// This acts as a minimal frontend data-access boundary.
// It can easily be replaced by real fetch() calls to a backend later.

export async function fetchContext(organizationId: string) {
  const data = getMockData(organizationId);
  if (!data.organization) {
    throw new Error("Organization not found");
  }
  return data;
}

export async function fetchProjects(organizationId: string): Promise<Project[]> {
  const data = getMockData(organizationId);
  return data.projects;
}

export async function fetchTasks(organizationId: string): Promise<Task[]> {
  const data = getMockData(organizationId);
  return data.tasks;
}

export async function fetchActivities(organizationId: string): Promise<Activity[]> {
  const data = getMockData(organizationId);
  return data.activities;
}

export async function fetchTeam(organizationId: string): Promise<User[]> {
  const data = getMockData(organizationId);
  return data.users;
}
