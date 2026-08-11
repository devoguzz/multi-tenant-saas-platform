"use client";

import React from "react";
import { FolderKanban } from "lucide-react";
import { EmptyState } from "@/components/states/empty-state";
import { toast } from "sonner";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Projects</h1>
        <p className="text-sm text-gray-500">Track and manage your ongoing work.</p>
      </div>
      <EmptyState
        icon={FolderKanban}
        title="No projects yet"
        description="Create a project to start organizing your tasks and timeline."
        actionLabel="New Project"
        onAction={() => toast.info("Project creation coming soon")}
      />
    </div>
  );
}
