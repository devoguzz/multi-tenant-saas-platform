"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { WorkspaceProvider } from "@/lib/context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <WorkspaceProvider>
      <div className="min-h-screen bg-gray-50">
        <AppSidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
        
        <div className="md:pl-64 flex flex-col min-h-screen">
          <TopBar onMenuClick={() => setMobileMenuOpen(true)} />
          
          <main className="flex-1">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 overflow-x-hidden">
              {children}
            </div>
          </main>
        </div>
      </div>
    </WorkspaceProvider>
  );
}
