"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Search, Menu, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { toast } from "sonner";
import { useWorkspace } from "@/lib/context";
import { useOrganizationData } from "@/lib/data/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db } from "@/lib/data/db";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const { activeOrganization, currentUser, logout } = useWorkspace();
  const context = useOrganizationData();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = context ? [
    ...context.projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => ({ ...p, _type: "Project" })),
    ...context.tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())).map(t => ({ ...t, _type: "Task" })),
    ...context.clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(c => ({ ...c, _type: "Client" })),
    ...context.users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map(u => ({ ...u, _type: "User" }))
  ].slice(0, 8) : [];

  const handleNavigate = (item: any) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    if (item._type === "Task") {
      router.push(`/tasks`);
    } else if (item._type === "Project") {
      router.push(`/projects/${item.id}`);
    } else if (item._type === "Client") {
      router.push(`/clients/${item.id}`);
    } else if (item._type === "User") {
      router.push(`/team`);
    }
  };

  const handleMarkAsRead = (id: string) => {
    db.markNotificationAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    if (activeOrganization) {
      db.markAllNotificationsAsRead(activeOrganization.id);
      toast.success("Marked all as read");
    }
  };

  if (!currentUser) return null;

  const unreadNotifications = context?.notifications?.filter(n => !n.read) || [];
  const allNotifications = context?.notifications || [];

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <Button variant="ghost" size="icon" className="-m-2.5 p-2.5 text-gray-700 md:hidden" onClick={onMenuClick}>
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </Button>

      <div className="flex flex-1 items-center justify-between gap-x-4 lg:gap-x-6">
        <div className="flex flex-1 relative" ref={searchRef}>
          <form className="relative flex flex-1 max-w-md" action="#" method="GET" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="search-field" className="sr-only">Search</label>
            <div className="relative w-full">
              <Search className="pointer-events-none absolute inset-y-0 left-3 h-full w-4 text-gray-400" aria-hidden="true" />
              <Input
                id="search-field"
                type="search"
                autoComplete="off"
                className="h-9 w-full rounded-md border-0 bg-gray-50 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                placeholder="Search workspace..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(e.target.value.length > 0);
                }}
                onFocus={() => searchQuery.length > 0 && setIsSearchOpen(true)}
              />
            </div>
          </form>
          
          {isSearchOpen && (
            <div className="absolute top-full left-0 z-50 mt-1 w-full max-w-md rounded-md border border-gray-200 bg-white shadow-lg overflow-hidden">
              <ul className="max-h-60 overflow-auto py-1 text-sm text-gray-700">
                {searchResults.length > 0 ? (
                  searchResults.map((item, idx) => (
                    <li key={idx} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleNavigate(item)}>
                      <span className="font-medium text-gray-900">{(item as any).title || (item as any).name}</span>
                      <span className="ml-2 text-xs text-gray-500">{item._type}</span>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">No results found</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-500 relative">
                <span className="sr-only">View notifications</span>
                <Bell className="h-5 w-5" aria-hidden="true" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                <span className="font-medium text-sm text-gray-900">Notifications</span>
                {unreadNotifications.length > 0 && (
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">
                    {unreadNotifications.length} new
                  </span>
                )}
              </div>
              <div className="py-1 max-h-80 overflow-y-auto">
                {allNotifications.length > 0 ? (
                  allNotifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`px-4 py-3 cursor-pointer text-sm border-b border-gray-50 transition-colors ${n.read ? 'opacity-60 hover:bg-gray-50' : 'bg-blue-50/30 hover:bg-blue-50/50'}`}
                      onClick={() => {
                        handleMarkAsRead(n.id);
                        if (n.link) router.push(n.link);
                      }}
                    >
                      <p className="text-gray-900 font-medium">{n.title}</p>
                      <p className="text-gray-500 mt-0.5">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-gray-500">
                    No notifications
                  </div>
                )}
              </div>
              {unreadNotifications.length > 0 && (
                <div className="border-t border-gray-100 p-2 text-center bg-gray-50">
                  <button 
                    className="text-xs font-medium text-blue-600 hover:text-blue-500"
                    onClick={handleMarkAllAsRead}
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
                <span className="sr-only">Open user menu</span>
                {currentUser.avatarUrl ? (
                  <Image
                    className="h-8 w-8 rounded-full bg-gray-50 object-cover"
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    width={32}
                    height={32}
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-medium text-sm">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-2">
                <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
                <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/settings?tab=PROFILE")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings?tab=WORKSPACE")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                logout();
                router.push("/login");
              }}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
