"use client";

import React, { use } from "react";
import { useOrganizationData } from "@/lib/data/hooks";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, CheckSquare, Clock, ArrowLeft, Users, Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const context = useOrganizationData();
  
  if (!context) return null;

  const project = context.projects.find(p => p.id === resolvedParams.id);
  
  if (!project) {
    return notFound();
  }

  const client = context.clients.find(c => c.id === project.clientId);
  const projectTasks = context.tasks.filter(t => t.projectId === project.id);
  const completedTasks = projectTasks.filter(t => t.status === "DONE").length;
  
  const projectActivities = context.activities.filter(a => 
    a.type.startsWith("PROJECT") && a.description.includes(project.name)
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Derive active members based on task assignments
  const memberIds = Array.from(new Set(projectTasks.map(t => t.assigneeId)));
  const members = context.users.filter(u => memberIds.includes(u.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="-ml-2">
          <Link href="/projects">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to projects</span>
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{project.name}</h1>
            <Badge variant={project.status === "COMPLETED" ? "success" : project.status === "ACTIVE" ? "info" : "secondary"}>
              {project.status.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">
                  {client ? <Link href={`/clients/${client.id}`} className="hover:underline">{client.name}</Link> : "Internal Project"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">
                  Due {new Date(project.dueDate).toLocaleDateString()}
                </span>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{completedTasks} of {projectTasks.length} tasks completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Tasks</CardTitle>
              <Button size="sm" asChild variant="outline">
                <Link href={`/tasks?project=${project.id}`}>Manage Tasks</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {projectTasks.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                  <CheckSquare className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  No tasks assigned to this project yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {projectTasks.slice(0, 5).map(task => {
                    const assignee = context.users.find(u => u.id === task.assigneeId);
                    return (
                      <div key={task.id} className="flex items-start justify-between border-b last:border-0 pb-4 last:pb-0">
                        <div>
                          <p className="font-medium text-gray-900">{task.title}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Badge variant="outline">{task.status.replace("_", " ")}</Badge>
                            {assignee && (
                              <span className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {assignee.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge 
                          variant={task.priority === "URGENT" ? "destructive" : task.priority === "HIGH" ? "warning" : "secondary"}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    );
                  })}
                  {projectTasks.length > 5 && (
                    <div className="pt-2 text-center">
                      <Link href={`/tasks?project=${project.id}`} className="text-sm text-blue-600 hover:underline">
                        View all {projectTasks.length} tasks
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Project Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {projectActivities.length === 0 ? (
                <div className="text-sm text-gray-500 py-2">No recent activity.</div>
              ) : (
                <div className="space-y-4">
                  {projectActivities.slice(0, 10).map(activity => {
                    const user = context.users.find(u => u.id === activity.userId);
                    return (
                      <div key={activity.id} className="flex gap-3 text-sm">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {user?.name.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="text-gray-900">
                            <span className="font-medium">{user?.name || "Someone"}</span> {activity.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(activity.createdAt).toLocaleDateString()} at {new Date(activity.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column for project members */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Team Members</CardTitle>
              <Badge variant="outline">{members.length}</Badge>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <p className="text-sm text-gray-500">No members assigned to tasks.</p>
              ) : (
                <div className="space-y-4">
                  {members.map(member => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-xs">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
