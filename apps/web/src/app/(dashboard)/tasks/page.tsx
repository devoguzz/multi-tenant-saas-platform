"use client";

import React, { useState, Suspense } from "react";
import { useOrganizationData, useDB } from "@/lib/data/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, MoreHorizontal, CheckSquare, Trash2, LayoutGrid, List } from "lucide-react";
import { TaskDialog } from "@/components/tasks/task-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Task } from "@/lib/types";
import { useSearchParams } from "next/navigation";

function TasksContent() {
  const context = useOrganizationData();
  const { db } = useDB();
  const searchParams = useSearchParams();
  const initialProjectId = searchParams.get("project") || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState(initialProjectId);
  const [viewMode, setViewMode] = useState<"BOARD" | "LIST">("BOARD");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  if (!context) return null;

  const tasks = context.tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = projectFilter === "" || task.projectId === projectFilter;
    return matchesSearch && matchesProject;
  });

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingTask(undefined);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await db.deleteTask(id);
        toast.success("Task deleted successfully");
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }
  };

  const handleStatusChange = async (task: Task, newStatus: Task["status"]) => {
    try {
      await db.updateTask(task.id, { status: newStatus });
      toast.success(`Task moved to ${newStatus.replace("_", " ")}`);
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  const statusGroups: { [key in Task["status"]]: Task[] } = {
    TODO: [],
    IN_PROGRESS: [],
    REVIEW: [],
    DONE: []
  };

  tasks.forEach(t => statusGroups[t.status].push(t));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tasks</h1>
          <p className="text-sm text-gray-500">Manage, prioritize, and track your team&apos;s work.</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 max-w-2xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search tasks..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="flex h-9 w-full sm:w-[220px] rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
        >
          <option value="">All Projects</option>
          {context.projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        
        <div className="flex items-center gap-1 border border-gray-200 rounded-md p-1 bg-gray-50 ml-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-7 px-2 ${viewMode === "BOARD" ? "bg-white shadow-sm" : "hover:bg-gray-100"}`}
            onClick={() => setViewMode("BOARD")}
          >
            <LayoutGrid className="h-4 w-4 mr-1.5" />
            <span className="text-xs">Board</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-7 px-2 ${viewMode === "LIST" ? "bg-white shadow-sm" : "hover:bg-gray-100"}`}
            onClick={() => setViewMode("LIST")}
          >
            <List className="h-4 w-4 mr-1.5" />
            <span className="text-xs">List</span>
          </Button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-md border bg-white shadow-sm overflow-hidden flex flex-col items-center justify-center p-12 text-center">
          <CheckSquare className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            {searchQuery || projectFilter !== "" ? "Try adjusting your filters." : "Get started by creating a new task."}
          </p>
          {(!searchQuery && projectFilter === "") && (
            <Button onClick={handleCreate} variant="outline">Add Task</Button>
          )}
        </div>
      ) : viewMode === "BOARD" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4">
          {(Object.keys(statusGroups) as Array<Task["status"]>).map(status => (
            <div key={status} className="flex flex-col h-full bg-gray-50/80 rounded-lg p-3 border border-gray-100 min-w-[280px]">
              <h3 className="font-semibold text-gray-700 text-sm mb-3 flex items-center justify-between">
                {status.replace("_", " ")}
                <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
                  {statusGroups[status].length}
                </span>
              </h3>
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[65vh] pr-1">
                {statusGroups[status].map(task => {
                  const project = context.projects.find(p => p.id === task.projectId);
                  const assignee = context.users.find(u => u.id === task.assigneeId);
                  return (
                    <div key={task.id} className="bg-white p-3.5 rounded-md border border-gray-200 shadow-sm hover:shadow transition-shadow group relative">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={task.priority === "URGENT" ? "destructive" : task.priority === "HIGH" ? "warning" : "secondary"} className="text-[10px] px-1.5 py-0">
                          {task.priority}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-700 -mr-1 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(task)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(task, "TODO")} disabled={task.status === "TODO"}>Move to To Do</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(task, "IN_PROGRESS")} disabled={task.status === "IN_PROGRESS"}>Move to In Progress</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(task, "REVIEW")} disabled={task.status === "REVIEW"}>Move to Review</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(task, "DONE")} disabled={task.status === "DONE"}>Move to Done</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => handleDelete(task.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-sm font-medium text-gray-900 leading-snug mb-2">{task.title}</p>
                      <div className="text-xs text-gray-500 mb-4 truncate">
                        {project?.name || "No Project"}
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                        <div className="text-[11px] text-gray-400 font-medium">
                          {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                        {assignee && (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-[11px] font-semibold border border-white shadow-sm" title={assignee.name}>
                            {assignee.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Task</th>
                <th className="px-6 py-3 font-medium">Project</th>
                <th className="px-6 py-3 font-medium">Assignee</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Due Date</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => {
                const project = context.projects.find(p => p.id === task.projectId);
                const assignee = context.users.find(u => u.id === task.assigneeId);
                return (
                  <tr key={task.id} className="bg-white border-b hover:bg-gray-50 last:border-0 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 mb-1">{task.title}</div>
                      <Badge variant={task.priority === "URGENT" ? "destructive" : task.priority === "HIGH" ? "warning" : "secondary"} className="text-[10px] px-1.5 py-0">
                        {task.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {project?.name || "—"}
                    </td>
                    <td className="px-6 py-4">
                      {assignee ? (
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-[11px] font-semibold">
                            {assignee.name.charAt(0)}
                          </div>
                          <span className="text-gray-700 text-sm">{assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task, e.target.value as Task["status"])}
                        className="text-xs font-medium rounded-md border-gray-200 py-1 pl-2 pr-6 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="REVIEW">Review</option>
                        <option value="DONE">Done</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(task)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => handleDelete(task.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {isDialogOpen && (
        <TaskDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          task={editingTask}
          defaultProjectId={projectFilter}
        />
      )}
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading tasks...</div>}>
      <TasksContent />
    </Suspense>
  );
}
