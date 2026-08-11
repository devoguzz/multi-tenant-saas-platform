"use client";

import React from "react";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/states/empty-state";
import { toast } from "sonner";

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Team</h1>
        <p className="text-sm text-gray-500">Manage your workspace members and their roles.</p>
      </div>
      <EmptyState
        icon={Users}
        title="Invite your team"
        description="Collaborate with your team by inviting them to this workspace."
        actionLabel="Invite Member"
        onAction={() => toast.info("Member invitations coming soon")}
      />
    </div>
  );
}
