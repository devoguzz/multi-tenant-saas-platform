"use client";

import React from "react";
import { CheckSquare } from "lucide-react";
import { EmptyState } from "@/components/states/empty-state";
import { toast } from "sonner";

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tasks</h1>
        <p className="text-sm text-gray-500">View and assign tasks across all projects.</p>
      </div>
      <EmptyState
        icon={CheckSquare}
        title="No tasks found"
        description="Create tasks to keep track of what needs to be done."
        actionLabel="Create Task"
        onAction={() => toast.info("Task creation coming soon")}
      />
    </div>
  );
}
