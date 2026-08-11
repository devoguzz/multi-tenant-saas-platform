"use client";

import React from "react";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/states/empty-state";
import { toast } from "sonner";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Clients</h1>
        <p className="text-sm text-gray-500">Manage your client organizations and contacts.</p>
      </div>
      <EmptyState
        icon={Users}
        title="No clients yet"
        description="Get started by adding your first client to the workspace."
        actionLabel="Add Client"
        onAction={() => toast.info("Client management coming soon")}
      />
    </div>
  );
}
