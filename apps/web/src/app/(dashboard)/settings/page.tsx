import React from "react";
import { Settings } from "lucide-react";
import { EmptyState } from "@/components/states/empty-state";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your workspace preferences and billing.</p>
      </div>
      <EmptyState
        icon={Settings}
        title="Settings coming soon"
        description="Workspace configuration options are currently being developed."
      />
    </div>
  );
}
