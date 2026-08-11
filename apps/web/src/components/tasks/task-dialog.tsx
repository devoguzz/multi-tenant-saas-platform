"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Task } from "@/lib/types";
import { useWorkspace } from "@/lib/context";
import { useDB, useOrganizationData } from "@/lib/data/hooks";
import { toast } from "sonner";

interface TaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  defaultProjectId?: string;
}

export function TaskDialog({ isOpen, onOpenChange, task, defaultProjectId }: TaskDialogProps) {
  const isEditing = !!task;
  const { activeOrganization } = useWorkspace();
  const { db } = useDB();
  const context = useOrganizationData();

  const [title, setTitle] = useState(task?.title || "");
  const [projectId, setProjectId] = useState(task?.projectId || defaultProjectId || "");
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [priority, setPriority] = useState<Task["priority"]>(task?.priority || "MEDIUM");
  const [status, setStatus] = useState<Task["status"]>(task?.status || "TODO");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) {
      toast.error("Please select a project");
      return;
    }
    
    setIsLoading(true);

    try {
      if (isEditing) {
        await db.updateTask(task.id, { title, projectId, assigneeId, dueDate, priority, status });
        toast.success("Task updated successfully");
      } else {
        await db.addTask({
          id: `tsk_${Date.now()}`,
          title,
          projectId,
          assigneeId,
          priority,
          status,
          dueDate,
          organizationId: activeOrganization!.id,
        });
        toast.success("Task created successfully");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to save task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Create Task"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the task details below." : "Enter the details for the new task."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title <span className="text-red-500">*</span></Label>
            <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Design homepage hero section" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="project">Project <span className="text-red-500">*</span></Label>
            <select 
              id="project" 
              required
              value={projectId} 
              onChange={(e) => setProjectId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a Project</option>
              {context?.projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            <select 
              id="assignee" 
              value={assigneeId} 
              onChange={(e) => setAssigneeId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Unassigned</option>
              {context?.users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select 
                id="priority" 
                value={priority} 
                onChange={(e) => setPriority(e.target.value as Task["priority"])}
                className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date <span className="text-red-500">*</span></Label>
              <Input id="dueDate" type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select 
                id="status" 
                value={status} 
                onChange={(e) => setStatus(e.target.value as Task["status"])}
                className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">Review</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          )}
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEditing ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
