"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown, Building } from "lucide-react";
import { mockOrganizations } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/lib/context";

export function WorkspaceSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { activeOrganization, setActiveOrganizationId } = useWorkspace();

  return (
    <div className="relative mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center space-x-2 truncate">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-blue-700">
            <Building className="h-4 w-4" />
          </div>
          <span className="truncate font-medium text-gray-900">{activeOrganization!.name}</span>
        </div>
        <ChevronsUpDown className="h-4 w-4 text-gray-500 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="p-1">
            {mockOrganizations.map((org) => (
              <button
                key={org.id}
                onClick={() => {
                  setActiveOrganizationId(org.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
                  activeOrganization!.id === org.id ? "bg-gray-50" : ""
                )}
              >
                <span className={cn(
                  "truncate",
                  activeOrganization!.id === org.id ? "font-medium text-gray-900" : "text-gray-700"
                )}>
                  {org.name}
                </span>
                {activeOrganization!.id === org.id && <Check className="h-4 w-4 text-blue-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
