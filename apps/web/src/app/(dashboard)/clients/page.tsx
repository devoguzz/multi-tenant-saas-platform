"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { useOrganizationData, useDB } from "@/lib/data/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, MoreHorizontal, Building2, Trash2 } from "lucide-react";
import { ClientDialog } from "@/components/clients/client-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { toast } from "sonner";
import { Client } from "@/lib/types";

export default function ClientsPage() {
  const context = useOrganizationData();
  const { db } = useDB();
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"name_asc" | "name_desc">("name_asc");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();

  if (!context) return null;

  const clients = context.clients
    .filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            client.industry.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesIndustry = industryFilter === "ALL" || client.industry === industryFilter;
      return matchesSearch && matchesIndustry;
    })
    .sort((a, b) => {
      if (sortOrder === "name_asc") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

  const industries = Array.from(new Set(context.clients.map(c => c.industry).filter(Boolean)));

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingClient(undefined);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
      try {
        await db.deleteClient(id);
        toast.success("Client deleted successfully");
      } catch (error) {
        toast.error("Failed to delete client");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500">Manage your clients and their associated projects.</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search clients..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Industries</option>
          {industries.map(ind => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as any)}
          className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="name_asc">Name (A-Z)</option>
          <option value="name_desc">Name (Z-A)</option>
        </select>
      </div>

      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        {clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No clients found</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              {searchQuery ? "Try adjusting your search query." : "Get started by adding a new client."}
            </p>
            {!searchQuery && (
              <Button onClick={handleCreate} variant="outline">Add Client</Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Industry</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Projects</th>
                  <th className="px-6 py-3 font-medium">Last Activity</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => {
                  const clientProjects = context.projects.filter(p => p.clientId === client.id);
                  const clientActivities = context.activities.filter(a => 
                    (a.type.includes("CLIENT") && a.description.includes(client.name)) || 
                    clientProjects.some(p => a.description.includes(p.name))
                  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                  const lastActivity = clientActivities[0];
                  
                  return (
                    <tr key={client.id} className="bg-white border-b hover:bg-gray-50 last:border-0 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <Link href={`/clients/${client.id}`} className="hover:underline hover:text-blue-600">
                          {client.name}
                        </Link>
                        {client.website && (
                          <div className="text-xs text-gray-500 font-normal mt-0.5">{client.website}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {client.industry || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={client.status === "ACTIVE" ? "success" : "secondary"}>
                          {client.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {clientProjects.length}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {lastActivity ? format(new Date(lastActivity.createdAt), "d MMM yyyy") : "—"}
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
                              <Link href={`/clients/${client.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(client)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => handleDelete(client.id)}>
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
        <ClientDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          client={editingClient}
        />
      )}
    </div>
  );
}
