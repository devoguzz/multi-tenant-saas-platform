"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/lib/context";
import { useDB, useOrganizationData } from "@/lib/data/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockCurrentUser } from "@/lib/mock-data";
import { toast } from "sonner";
import { AlertTriangle, HardDrive, User as UserIcon, Building, Settings2 } from "lucide-react";

export default function SettingsPage() {
  const { activeOrganization, currentUser } = useWorkspace();
  const context = useOrganizationData();
  const { db } = useDB();
  
  const [activeTab, setActiveTab] = useState("PROFILE");
  
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile preferences updated (locally)");
  };

  const handleResetData = () => {
    if (confirm("WARNING: This will delete all custom frontend state and restore the original mock data. Are you absolutely sure?")) {
      db.reset();
      toast.success("Demo data has been reset to defaults");
    }
  };

  if (!context) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your profile and workspace preferences.</p>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`pb-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 mr-6 ${activeTab === "PROFILE" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
          onClick={() => setActiveTab("PROFILE")}
        >
          <UserIcon className="h-4 w-4" /> Profile
        </button>
        <button
          className={`pb-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 mr-6 ${activeTab === "WORKSPACE" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
          onClick={() => setActiveTab("WORKSPACE")}
        >
          <Building className="h-4 w-4" /> Workspace
        </button>
        <button
          className={`pb-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === "DANGER" ? "border-red-500 text-red-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
          onClick={() => setActiveTab("DANGER")}
        >
          <Settings2 className="h-4 w-4" /> Advanced
        </button>
      </div>

      <div className="grid gap-6">
        {activeTab === "PROFILE" && (
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details for this workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} disabled />
                  <p className="text-xs text-gray-500">Email cannot be changed in the demo environment.</p>
                </div>
                <Button type="submit">Save Profile</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === "WORKSPACE" && (
          <Card>
            <CardHeader>
              <CardTitle>Workspace Configuration</CardTitle>
              <CardDescription>Details for the currently active workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label>Organization Name</Label>
                  <Input value={context.organization?.name || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Organization Slug</Label>
                  <Input value={context.organization?.slug || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Plan</Label>
                  <Input value={context.organization?.plan || ""} disabled />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "DANGER" && (
          <Card className="border-red-100">
            <CardHeader className="bg-red-50/50 rounded-t-lg">
              <CardTitle className="text-red-700 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-red-600/80">Irreversible destructive actions.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-gray-500" />
                    Reset Demo Data
                  </h4>
                  <p className="text-sm text-gray-500 max-w-md mt-1">
                    Wipe all frontend localStorage state and restore the original seeded mock data. This will delete all custom clients, projects, and tasks.
                  </p>
                </div>
                <Button variant="destructive" onClick={handleResetData}>
                  Reset Data
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
