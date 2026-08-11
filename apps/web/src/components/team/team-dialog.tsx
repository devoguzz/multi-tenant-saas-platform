"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/lib/types";
import { useWorkspace } from "@/lib/context";
import { useDB } from "@/lib/data/hooks";
import { toast } from "sonner";

interface TeamDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
}

export function TeamDialog({ isOpen, onOpenChange, user }: TeamDialogProps) {
  const isEditing = !!user;
  const { activeOrganization } = useWorkspace();
  const { db } = useDB();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState<User["role"]>(user?.role || "MEMBER");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditing) {
        await db.updateUserRole(user.id, role);
        toast.success("Team member role updated");
      } else {
        await db.inviteUser({
          id: `usr_${Date.now()}`,
          name,
          email,
          role,
          status: "OFFLINE",
          organizationId: activeOrganization!.id,
        });
        toast.success("Team member invited");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to save team member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Team Member" : "Invite Team Member"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the member's role." : "Invite a new member to join the workspace."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name {isEditing && <span className="text-gray-400 text-xs">(Read-only)</span>}</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} disabled={isEditing} placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address {isEditing && <span className="text-gray-400 text-xs">(Read-only)</span>}</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isEditing} placeholder="john@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select 
              id="role" 
              value={role} 
              onChange={(e) => setRole(e.target.value as User["role"])}
              className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="ADMIN">Admin</option>
              <option value="MEMBER">Member</option>
              <option value="GUEST">Guest</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Admins have full access. Members can edit data. Guests have read-only access.
            </p>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEditing ? "Update Role" : "Send Invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
