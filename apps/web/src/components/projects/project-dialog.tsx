"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Project } from "@/lib/types";
import { useWorkspace } from "@/lib/context";
import { useDB, useOrganizationData } from "@/lib/data/hooks";
import { toast } from "sonner";

interface ProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project;
}

export function ProjectDialog({ isOpen, onOpenChange, project }: ProjectDialogProps) {
  const isEditing = !!project;
  const { activeOrganization } = useWorkspace();
  const { db } = useDB();
  const context = useOrganizationData();

  const [name, setName] = useState(project?.name || "");
  const [clientId, setClientId] = useState(project?.clientId || "");
  const [dueDate, setDueDate] = useState(project?.dueDate || "");
  const [status, setStatus] = useState<Project["status"]>(project?.status || "PLANNING");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditing) {
        await db.updateProject(project.id, { name, clientId, dueDate, status });
        toast.success("Project updated successfully");
      } else {
        await db.addProject({
          id: `prj_${Date.now()}`,
          name,
          clientId,
          dueDate,
          status,
          progress: 0,
          organizationId: activeOrganization!.id,
        });
        toast.success("Project created successfully");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to save project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the project details below." : "Enter the details for the new project."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name <span className="text-red-500">*</span></Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Website Redesign" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <select 
              id="client" 
              value={clientId} 
              onChange={(e) => setClientId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">No Client (Internal)</option>
              {context?.clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date <span className="text-red-500">*</span></Label>
            <Input id="dueDate" type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>

          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select 
                id="status" 
                value={status} 
                onChange={(e) => setStatus(e.target.value as Project["status"])}
                className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="PLANNING">Planning</option>
                <option value="ACTIVE">Active</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          )}
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEditing ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
