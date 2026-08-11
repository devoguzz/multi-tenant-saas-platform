"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Search, Menu, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockCurrentUser, mockProjects, mockTasks } from "@/lib/mock-data";
import Image from "next/image";
import { toast } from "sonner";
import { useWorkspace } from "@/lib/context";
import Link from "next/link";

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const { activeOrganization } = useWorkspace();

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setIsSearchOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = [
    ...mockProjects.filter(p => p.organizationId === activeOrganization.id && p.name.toLowerCase().includes(searchQuery.toLowerCase())),
    ...mockTasks.filter(t => t.organizationId === activeOrganization.id && t.title.toLowerCase().includes(searchQuery.toLowerCase()))
  ].slice(0, 5);

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <Button variant="ghost" size="icon" className="-m-2.5 p-2.5 text-gray-700 md:hidden" onClick={onMenuClick}>
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </Button>

      <div className="flex flex-1 items-center justify-between gap-x-4 lg:gap-x-6">
        <div className="flex flex-1 relative" ref={searchRef}>
          <form className="relative flex flex-1 max-w-md" action="#" method="GET" onSubmit={(e) => { e.preventDefault(); toast.info("Search feature coming soon"); }}>
            <label htmlFor="search-field" className="sr-only">Search</label>
            <div className="relative w-full">
              <Search className="pointer-events-none absolute inset-y-0 left-3 h-full w-4 text-gray-400" aria-hidden="true" />
              <Input
                id="search-field"
                type="search"
                autoComplete="off"
                className="h-9 w-full rounded-md border-0 bg-gray-50 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                placeholder="Search projects and tasks..."
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
                    <li key={idx} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { setIsSearchOpen(false); toast.success(`Navigating to ${'title' in item ? item.title : item.name}`); }}>
                      <span className="font-medium text-gray-900">{'title' in item ? item.title : item.name}</span>
                      <span className="ml-2 text-xs text-gray-500">{'title' in item ? 'Task' : 'Project'}</span>
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
          <div className="relative" ref={notifRef}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-gray-500 relative"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-5 w-5" aria-hidden="true" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>
            
            {isNotifOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="p-3 border-b border-gray-100 font-medium text-sm text-gray-900">Notifications</div>
                <div className="py-1 max-h-60 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm">
                    <p className="text-gray-900 font-medium">New task assigned</p>
                    <p className="text-gray-500 mt-0.5">Alice assigned you a new task.</p>
                    <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm border-t border-gray-100">
                    <p className="text-gray-900 font-medium">Project updated</p>
                    <p className="text-gray-500 mt-0.5">Website redesign moved to Review.</p>
                    <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
                  </div>
                </div>
                <div className="border-t border-gray-100 p-2 text-center">
                  <button className="text-xs font-medium text-blue-600 hover:text-blue-500" onClick={() => { setIsNotifOpen(false); toast.info("View all notifications coming soon"); }}>
                    View all
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button 
              className="flex items-center p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <span className="sr-only">Open user menu</span>
              {mockCurrentUser.avatarUrl ? (
                <Image
                  className="h-8 w-8 rounded-full bg-gray-50 object-cover"
                  src={mockCurrentUser.avatarUrl}
                  alt={mockCurrentUser.name}
                  width={32}
                  height={32}
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-medium text-sm">
                  {mockCurrentUser.name.charAt(0)}
                </div>
              )}
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">{mockCurrentUser.name}</p>
                  <p className="text-xs text-gray-500 truncate">{mockCurrentUser.email}</p>
                </div>
                <Link href="/settings" onClick={() => setIsProfileOpen(false)} className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center">
                  <User className="mr-2 h-4 w-4" /> Profile
                </Link>
                <Link href="/settings" onClick={() => setIsProfileOpen(false)} className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Link>
                <button 
                  onClick={() => {
                    setIsProfileOpen(false);
                    window.location.href = "/login";
                  }}
                  className="flex w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center border-t border-gray-100 mt-1 pt-2"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
