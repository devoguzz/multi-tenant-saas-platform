"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Client } from "@/lib/types";
import { useWorkspace } from "@/lib/context";
import { useDB } from "@/lib/data/hooks";
import { toast } from "sonner";

interface ClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client;
}

export function ClientDialog({ isOpen, onOpenChange, client }: ClientDialogProps) {
  const isEditing = !!client;
  const { activeOrganization } = useWorkspace();
  const { db } = useDB();

  const [name, setName] = useState(client?.name || "");
  const [website, setWebsite] = useState(client?.website || "");
  const [industry, setIndustry] = useState(client?.industry || "");
  const [status, setStatus] = useState<Client["status"]>(client?.status || "ACTIVE");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = { name, website, industry, status };
      if (isEditing) {
        await db.updateClient(client.id, data);
        toast.success("Client updated successfully");
      } else {
        await db.addClient({
          id: `cli_${Date.now()}`,
          ...data,
          organizationId: activeOrganization!.id,
        });
        toast.success("Client created successfully");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to save client");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Client" : "Add New Client"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the client's information below." : "Enter the details for the new client."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name <span className="text-red-500">*</span></Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Corp" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://acme.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Manufacturing" />
          </div>
          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select 
                id="status" 
                value={status} 
                onChange={(e) => setStatus(e.target.value as Client["status"])}
                className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          )}
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEditing ? "Save Changes" : "Create Client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
