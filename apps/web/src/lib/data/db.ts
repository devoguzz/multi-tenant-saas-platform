import { 
  Organization, User, Client, Project, Task, Activity, Notification 
} from "../types";
import { 
  mockOrganizations, mockUsers, mockClients, mockProjects, mockTasks, mockActivities, mockNotifications 
} from "../mock-data";

const STORAGE_KEY = "saas_platform_data";

export interface DBState {
  organizations: Organization[];
  users: User[];
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  activities: Activity[];
  notifications: Notification[];
  activeUserId: string | null;
  activeOrganizationId: string | null;
}

// Initial hydration from mock data if localStorage is empty
function getInitialState(): DBState {
  if (typeof window === "undefined") {
    return {
      organizations: mockOrganizations,
      users: mockUsers,
      clients: mockClients,
      projects: mockProjects,
      tasks: mockTasks,
      activities: mockActivities,
      notifications: mockNotifications,
      activeUserId: "usr_1", // Default for demo
      activeOrganizationId: "org_1", // Default for demo
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as DBState;
      return {
        ...parsed,
        notifications: parsed.notifications || [],
      };
    } catch (e) {
      console.error("Failed to parse local DB state, resetting to mock data");
    }
  }

  const defaultState: DBState = {
    organizations: mockOrganizations,
    users: mockUsers,
    clients: mockClients,
    projects: mockProjects,
    tasks: mockTasks,
    activities: mockActivities,
    notifications: mockNotifications,
    activeUserId: "usr_1",
    activeOrganizationId: "org_1",
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
  return defaultState;
}

class FrontendDB {
  private state: DBState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = getInitialState();
  }

  private persist() {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    }
    this.notify();
  }

  public reset() {
    const defaultState: DBState = {
      organizations: mockOrganizations,
      users: mockUsers,
      clients: mockClients,
      projects: mockProjects,
      tasks: mockTasks,
      activities: mockActivities,
      notifications: mockNotifications,
      activeUserId: "usr_1",
      activeOrganizationId: "org_1",
    };
    this.state = defaultState;
    this.persist();
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // Generic getter
  getState() {
    return this.state;
  }

  // -- CRUD Operations (Simulating Async API Calls) -- //

  async getContext(orgId: string) {
    return {
      organization: this.state.organizations.find(o => o.id === orgId) || this.state.organizations[0],
      users: this.state.users.filter(u => u.organizationId === orgId),
      clients: this.state.clients.filter(c => c.organizationId === orgId),
      projects: this.state.projects.filter(p => p.organizationId === orgId),
      tasks: this.state.tasks.filter(t => t.organizationId === orgId),
      activities: this.state.activities.filter(a => a.organizationId === orgId),
      notifications: (this.state.notifications || []).filter(n => n.organizationId === orgId && n.userId === this.state.activeUserId),
    };
  }

  // -- Auth & Workspace Operations -- //
  
  async login(email: string) {
    const user = this.state.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (user) {
      this.state.activeUserId = user.id;
      this.state.activeOrganizationId = user.organizationId;
      this.persist();
      return true;
    }
    return false;
  }

  async logout() {
    this.state.activeUserId = null;
    this.state.activeOrganizationId = null;
    this.persist();
  }

  async createOrganization(org: Organization, ownerName: string, ownerEmail: string) {
    this.state.organizations.push(org);
    const ownerId = `usr_${Date.now()}`;
    this.state.users.push({
      id: ownerId,
      name: ownerName,
      email: ownerEmail,
      role: "OWNER",
      organizationId: org.id,
      status: "ONLINE",
    });
    this.state.activeUserId = ownerId;
    this.state.activeOrganizationId = org.id;
    this.logActivity(org.id, "WORKSPACE_CREATED", `Workspace '${org.name}' was created`, ownerId);
    this.persist();
  }

  setActiveWorkspace(orgId: string) {
    this.state.activeOrganizationId = orgId;
    this.persist();
  }

  // -- Notification Operations -- //
  
  async markNotificationAsRead(id: string) {
    this.state.notifications = (this.state.notifications || []).map(n => n.id === id ? { ...n, read: true } : n);
    this.persist();
  }

  async markAllNotificationsAsRead(orgId: string) {
    this.state.notifications = (this.state.notifications || []).map(n => 
      (n.organizationId === orgId && n.userId === this.state.activeUserId) ? { ...n, read: true } : n
    );
    this.persist();
  }

  async addClient(client: Client) {
    this.state.clients.push(client);
    this.logActivity(client.organizationId, "CLIENT_CREATED", `created client '${client.name}'`, this.state.activeUserId || "usr_1");
    this.persist();
  }

  async updateClient(id: string, data: Partial<Client>) {
    this.state.clients = this.state.clients.map(c => c.id === id ? { ...c, ...data } : c);
    const client = this.state.clients.find(c => c.id === id);
    if (client) {
      this.logActivity(client.organizationId, "CLIENT_EDITED", `updated client '${client.name}'`, this.state.activeUserId || "usr_1");
    }
    this.persist();
  }

  async deleteClient(id: string) {
    this.state.clients = this.state.clients.filter(c => c.id !== id);
    this.persist();
  }

  async addProject(project: Project) {
    this.state.projects.push(project);
    this.logActivity(project.organizationId, "PROJECT_CREATED", `created project '${project.name}'`, "usr_1");
    this.persist();
  }

  async updateProject(id: string, data: Partial<Project>) {
    this.state.projects = this.state.projects.map(p => p.id === id ? { ...p, ...data } : p);
    const project = this.state.projects.find(p => p.id === id);
    if (project) {
      this.logActivity(project.organizationId, "PROJECT_EDITED", `updated project '${project.name}'`, this.state.activeUserId || "usr_1");
    }
    this.persist();
  }

  async deleteProject(id: string) {
    this.state.projects = this.state.projects.filter(p => p.id !== id);
    this.persist();
  }

  async addTask(task: Task) {
    this.state.tasks.push(task);
    this.logActivity(task.organizationId, "TASK_CREATED", `created task '${task.title}'`, this.state.activeUserId || "usr_1");
    this.persist();
  }

  async updateTask(id: string, data: Partial<Task>) {
    this.state.tasks = this.state.tasks.map(t => t.id === id ? { ...t, ...data } : t);
    if (data.status) {
      const task = this.state.tasks.find(t => t.id === id)!;
      this.logActivity(task.organizationId, "TASK_STATUS_CHANGED", `moved '${task.title}' to ${task.status}`, "usr_1");
      this.recalculateProjectProgress(task.projectId);
    }
    this.persist();
  }

  async deleteTask(id: string) {
    const task = this.state.tasks.find(t => t.id === id);
    this.state.tasks = this.state.tasks.filter(t => t.id !== id);
    if (task) this.recalculateProjectProgress(task.projectId);
    this.persist();
  }

  async inviteUser(user: User) {
    this.state.users.push(user);
    this.logActivity(user.organizationId, "MEMBER_INVITED", `invited ${user.name} to the workspace`, this.state.activeUserId || "usr_1");
    this.persist();
  }

  async updateUserRole(id: string, role: User["role"]) {
    this.state.users = this.state.users.map(u => u.id === id ? { ...u, role } : u);
    const user = this.state.users.find(u => u.id === id);
    if (user) {
       this.logActivity(user.organizationId, "MEMBER_ROLE_CHANGED", `changed role of ${user.name} to ${role}`, this.state.activeUserId || "usr_1");
    }
    this.persist();
  }

  async removeUser(id: string) {
    this.state.users = this.state.users.filter(u => u.id !== id);
    this.persist();
  }

  // Internal Helpers
  private recalculateProjectProgress(projectId: string) {
    const pTasks = this.state.tasks.filter(t => t.projectId === projectId);
    if (pTasks.length === 0) return;
    const completed = pTasks.filter(t => t.status === "DONE").length;
    const progress = Math.round((completed / pTasks.length) * 100);
    this.state.projects = this.state.projects.map(p => p.id === projectId ? { ...p, progress } : p);
  }

  private logActivity(organizationId: string, type: Activity["type"], description: string, userId: string) {
    this.state.activities.unshift({
      id: `act_${Date.now()}`,
      type,
      description,
      userId,
      createdAt: new Date().toISOString(),
      organizationId
    });
  }
}

export const db = new FrontendDB();
