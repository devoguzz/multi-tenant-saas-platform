"use client";

import React, { use } from "react";
import { useOrganizationData } from "@/lib/data/hooks";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, Building2, Globe, Clock, ArrowLeft, Mail, Phone, Users } from "lucide-react";
import { useDB } from "@/lib/data/hooks";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const context = useOrganizationData();
  const { db } = useDB();
  
  if (!context) return null;

  const client = context.clients.find(c => c.id === resolvedParams.id);
  
  if (!client) {
    return notFound();
  }

  const clientProjects = context.projects.filter(p => p.clientId === client.id);
  const clientActivities = context.activities.filter(a => 
    a.type.startsWith("CLIENT") && a.description.includes(client.name)
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="-ml-2">
          <Link href="/clients">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to clients</span>
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{client.name}</h1>
            <Badge variant={client.status === "ACTIVE" ? "success" : "secondary"}>
              {client.status}
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
              {client.industry && (
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{client.industry}</span>
                </div>
              )}
              {client.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <a href={client.website.startsWith('http') ? client.website : `https://${client.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    {client.website}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Projects</CardTitle>
              <Button size="sm" asChild variant="outline">
                <Link href={`/projects?client=${client.id}`}>View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {clientProjects.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                  <FolderKanban className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  No projects linked to this client.
                </div>
              ) : (
                <div className="space-y-4">
                  {clientProjects.map(project => (
                    <div key={project.id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                      <div>
                        <Link href={`/projects/${project.id}`} className="font-medium text-gray-900 hover:underline">
                          {project.name}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Badge variant="outline">{project.status}</Badge>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Due {new Date(project.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {project.progress}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              {clientActivities.length === 0 ? (
                <div className="text-sm text-gray-500 py-2">No recent activity.</div>
              ) : (
                <div className="space-y-4">
                  {clientActivities.map(activity => {
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
        
        {/* Right Sidebar (Contacts) */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Key Contacts</CardTitle>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500">
                <Users className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border border-gray-100 rounded-lg bg-gray-50">
                <h4 className="font-medium text-sm text-gray-900">John Doe</h4>
                <p className="text-xs text-gray-500 mb-2">CEO & Founder</p>
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <Mail className="h-3 w-3" />
                  john@{client.website || "example.com"}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone className="h-3 w-3" />
                  +1 (555) 123-4567
                </div>
              </div>
              
              <div className="p-3 border border-gray-100 rounded-lg bg-gray-50">
                <h4 className="font-medium text-sm text-gray-900">Jane Smith</h4>
                <p className="text-xs text-gray-500 mb-2">Head of Operations</p>
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <Mail className="h-3 w-3" />
                  jane@{client.website || "example.com"}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone className="h-3 w-3" />
                  +1 (555) 987-6543
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
