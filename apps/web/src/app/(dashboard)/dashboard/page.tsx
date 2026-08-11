"use client";

import React from "react";
import { FolderKanban, CheckSquare, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspace } from "@/lib/context";
import { useOrganizationData, useDB } from "@/lib/data/hooks";
import { toast } from "sonner";

export default function DashboardPage() {
  const { activeOrganization, currentUser } = useWorkspace();
  const context = useOrganizationData();
  const { db } = useDB();
  
  if (!context || !currentUser) return null;
  const { projects, tasks, activities, users } = context;

  const activeProjectsCount = projects.filter(p => p.status === "ACTIVE").length;
  const openTasksCount = tasks.filter(t => t.status === "TODO" || t.status === "IN_PROGRESS").length;
  const completedTasks = tasks.filter(t => t.status === "DONE").length;
  const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== "DONE").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back, {currentUser.name}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjectsCount}</div>
            <p className="text-xs text-gray-500">Total in progress</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTasksCount}</div>
            <p className="text-xs text-gray-500">Tasks requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-gray-500">Tasks finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueTasks}</div>
            <p className="text-xs text-gray-500">Tasks past deadline</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.slice(0, 4).map(project => (
                <div key={project.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium leading-none">{project.name}</p>
                    <p className="text-sm text-gray-500">
                      {context.clients.find(c => c.id === project.clientId)?.name || "Internal"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {project.status}
                    </span>
                    <span className="text-xs text-gray-500">{project.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.filter(t => t.assigneeId === currentUser.id).slice(0, 4).map(task => (
                <div key={task.id} className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <input 
                      type="checkbox" 
                      checked={task.status === "DONE"}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                      onChange={async (e) => {
                        const newStatus = e.target.checked ? "DONE" : "TODO";
                        try {
                          await db.updateTask(task.id, { status: newStatus });
                          toast.success(`Task marked as ${newStatus === "DONE" ? "completed" : "todo"}`);
                        } catch (error) {
                          toast.error("Failed to update task");
                        }
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium leading-none">{task.title}</p>
                      <p className="text-sm text-gray-500 mt-1">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    task.priority === 'URGENT' ? 'bg-red-50 text-red-700 ring-red-600/10' :
                    task.priority === 'HIGH' ? 'bg-orange-50 text-orange-700 ring-orange-600/10' :
                    'bg-gray-50 text-gray-700 ring-gray-500/10'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.slice(0, 4).map(activity => {
                const user = users.find(u => u.id === activity.userId);
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium">
                      {user?.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium text-gray-900">{user?.name}</span>{" "}
                        <span className="text-gray-500">{activity.description}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Team Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Team Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.slice(0, 4).map(user => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                        user.status === 'ONLINE' ? 'bg-green-400' : 
                        user.status === 'BUSY' ? 'bg-red-400' : 'bg-gray-300'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-sm text-gray-500 mt-1">{user.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
