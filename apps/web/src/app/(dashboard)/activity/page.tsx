"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { useOrganizationData } from "@/lib/data/hooks";
import { ActivitySquare, FolderKanban, CheckSquare, Users, Building2, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ActivityPage() {
  const context = useOrganizationData();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [actorFilter, setActorFilter] = useState("ALL");

  if (!context) return null;

  const activities = context.activities
    .filter(activity => {
      const matchesSearch = activity.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "ALL" || activity.type.startsWith(typeFilter);
      const matchesActor = actorFilter === "ALL" || activity.userId === actorFilter;
      return matchesSearch && matchesType && matchesActor;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getIcon = (type: string) => {
    switch (type) {
      case "PROJECT_CREATED": return <FolderKanban className="h-4 w-4 text-blue-500" />;
      case "TASK_STATUS_CHANGED": 
      case "TASK_COMPLETED": return <CheckSquare className="h-4 w-4 text-green-500" />;
      case "MEMBER_INVITED": return <Users className="h-4 w-4 text-purple-500" />;
      case "CLIENT_CREATED": return <Building2 className="h-4 w-4 text-orange-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Activity Log</h1>
          <p className="text-sm text-gray-500">View all recent actions and audit events in your workspace.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 max-w-2xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search activity..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="flex h-9 w-full sm:w-[180px] rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
        >
          <option value="ALL">All Types</option>
          <option value="PROJECT">Projects</option>
          <option value="TASK">Tasks</option>
          <option value="CLIENT">Clients</option>
          <option value="MEMBER">Members</option>
          <option value="WORKSPACE">Workspace</option>
        </select>
        <select
          value={actorFilter}
          onChange={(e) => setActorFilter(e.target.value)}
          className="flex h-9 w-full sm:w-[180px] rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
        >
          <option value="ALL">All Members</option>
          {context.users.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>

      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <ActivitySquare className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No recent activity</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Actions performed by you and your team will appear here.
            </p>
          </div>
        ) : (
          <div className="flow-root p-6">
            <ul role="list" className="-mb-8">
              {activities.map((activity, activityIdx) => {
                const user = context.users.find(u => u.id === activity.userId);
                const isLast = activityIdx === activities.length - 1;
                return (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {!isLast ? (
                        <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-gray-50 ring-8 ring-white flex items-center justify-center border border-gray-100 shadow-sm">
                            {getIcon(activity.type)}
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium text-gray-900">{user?.name || "System"}</span>{' '}
                              {activity.description}
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-xs text-gray-400">
                            {format(new Date(activity.createdAt), "d MMM yyyy")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
