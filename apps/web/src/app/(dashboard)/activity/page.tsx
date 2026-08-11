import React from "react";
import { ActivitySquare } from "lucide-react";
import { EmptyState } from "@/components/states/empty-state";

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Activity</h1>
        <p className="text-sm text-gray-500">View all recent actions in your workspace.</p>
      </div>
      <EmptyState
        icon={ActivitySquare}
        title="No recent activity"
        description="Actions performed by you and your team will appear here."
      />
    </div>
  );
}
