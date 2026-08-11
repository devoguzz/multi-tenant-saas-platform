"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { useOrganizationData, useDB } from "@/lib/data/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, MoreHorizontal, FolderKanban, Trash2 } from "lucide-react";
import { ProjectDialog } from "@/components/projects/project-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { toast } from "sonner";
import { Project } from "@/lib/types";

export default function ProjectsPage() {
  const context = useOrganizationData();
  const { db } = useDB();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [clientFilter, setClientFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("dueDate_asc");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();

  if (!context) return null;

  const projects = context.projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || project.status === statusFilter;
      const matchesClient = clientFilter === "ALL" || (clientFilter === "INTERNAL" && !project.clientId) || project.clientId === clientFilter;
      return matchesSearch && matchesStatus && matchesClient;
    })
    .sort((a, b) => {
      if (sortOrder === "dueDate_asc") return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (sortOrder === "dueDate_desc") return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      if (sortOrder === "progress_desc") return b.progress - a.progress;
      if (sortOrder === "progress_asc") return a.progress - b.progress;
      if (sortOrder === "name_asc") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingProject(undefined);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project? This will also remove associated tasks.")) {
      try {
        await db.deleteProject(id);
        toast.success("Project deleted successfully");
      } catch (error) {
        toast.error("Failed to delete project");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500">Manage ongoing work, progress, and timelines.</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 max-w-2xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex h-9 w-full sm:w-[160px] rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
        >
          <option value="ALL">All Statuses</option>
          <option value="PLANNING">Planning</option>
          <option value="ACTIVE">Active</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <select
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          className="flex h-9 w-full sm:w-[160px] rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
        >
          <option value="ALL">All Clients</option>
          <option value="INTERNAL">Internal</option>
          {context.clients.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="flex h-9 w-full sm:w-[180px] rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
        >
          <option value="dueDate_asc">Due Date (Earliest)</option>
          <option value="dueDate_desc">Due Date (Latest)</option>
          <option value="progress_desc">Progress (High to Low)</option>
          <option value="progress_asc">Progress (Low to High)</option>
          <option value="name_asc">Name (A-Z)</option>
          <option value="name_desc">Name (Z-A)</option>
        </select>
      </div>

      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <FolderKanban className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              {searchQuery || statusFilter !== "ALL" ? "Try adjusting your filters." : "Get started by adding a new project."}
            </p>
            {(!searchQuery && statusFilter === "ALL") && (
              <Button onClick={handleCreate} variant="outline">Add Project</Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 font-medium">Project Name</th>
                  <th className="px-6 py-3 font-medium">Client</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Progress</th>
                  <th className="px-6 py-3 font-medium">Due Date</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => {
                  const client = context.clients.find(c => c.id === project.clientId);
                  return (
                    <tr key={project.id} className="bg-white border-b hover:bg-gray-50 last:border-0 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <Link href={`/projects/${project.id}`} className="hover:underline hover:text-blue-600">
                          {project.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {client ? (
                          <Link href={`/clients/${client.id}`} className="hover:underline text-gray-700">
                            {client.name}
                          </Link>
                        ) : "Internal"}
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant={
                            project.status === "COMPLETED" ? "success" : 
                            project.status === "ACTIVE" ? "info" : 
                            project.status === "ON_HOLD" ? "warning" : "default"
                          }
                        >
                          {project.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                          </div>
                          <span className="text-xs text-gray-500">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {format(new Date(project.dueDate), "d MMM yyyy")}
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
                            <DropdownMenuItem asChild>
                              <Link href={`/projects/${project.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(project)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => handleDelete(project.id)}>
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
      </div>

      {isDialogOpen && (
        <ProjectDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          project={editingProject}
        />
      )}
    </div>
  );
}
