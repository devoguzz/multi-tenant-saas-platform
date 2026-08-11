"use client";

import React, { useState } from "react";
import { useOrganizationData, useDB } from "@/lib/data/hooks";
import { useWorkspace } from "@/lib/context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, MoreHorizontal, Users, Trash2 } from "lucide-react";
import { TeamDialog } from "@/components/team/team-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { User } from "@/lib/types";
export default function TeamPage() {
  const context = useOrganizationData();
  const { activeOrganization, currentUser } = useWorkspace();
  const { db } = useDB();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();

  if (!context) return null;

  const members = context.users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    if (currentUser?.role !== "ADMIN" && currentUser?.role !== "OWNER") {
      toast.error("You don't have permission to invite members.");
      return;
    }
    setEditingUser(undefined);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (currentUser?.role !== "ADMIN" && currentUser?.role !== "OWNER") {
      toast.error("You don't have permission to remove members.");
      return;
    }
    if (id === currentUser?.id) {
      toast.error("You cannot remove yourself");
      return;
    }
    const admins = context.users.filter(u => u.role === "ADMIN");
    const isRemovingAdmin = context.users.find(u => u.id === id)?.role === "ADMIN";
    if (isRemovingAdmin && admins.length === 1) {
      toast.error("Cannot remove the last Admin");
      return;
    }
    
    if (confirm("Are you sure you want to remove this member from the workspace?")) {
      try {
        await db.removeUser(id);
        toast.success("Member removed successfully");
      } catch (error) {
        toast.error("Failed to remove member");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Team</h1>
          <p className="text-sm text-gray-500">Manage members, roles, and access controls.</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search team members..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        {members.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Users className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No members found</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Try adjusting your search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 font-medium">Member</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Assigned Tasks</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((user) => {
                  const assignedTasks = context.tasks.filter(t => t.assigneeId === user.id && t.status !== "DONE");
                  return (
                    <tr key={user.id} className="bg-white border-b hover:bg-gray-50 last:border-0 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-medium shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 flex items-center gap-2">
                              {user.name}
                              {user.id === currentUser?.id && (
                                <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-normal">You</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`block h-2 w-2 rounded-full ${
                            user.status === 'ONLINE' ? 'bg-green-500' : 
                            user.status === 'BUSY' ? 'bg-red-500' : 'bg-gray-300'
                          }`} />
                          <span className="text-gray-500 capitalize">{user.status.toLowerCase()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {assignedTasks.length}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {(currentUser?.role === "ADMIN" || currentUser?.role === "OWNER") && user.id !== currentUser?.id ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(user)}>
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => handleDelete(user.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <span className="text-xs text-gray-400">Restricted</span>
                        )}
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
        <TeamDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          user={editingUser}
        />
      )}
    </div>
  );
}
