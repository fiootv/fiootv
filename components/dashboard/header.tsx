"use client";

import { Search, Bell, Settings, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden text-gray-400 hover:text-white hover:bg-gray-800 mr-4"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
            />
          </div>
        </div>
8
        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
            <Bell className="w-5 h-5" />
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
            <Settings className="w-5 h-5" />
          </Button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-gray-400">admin@fiootv.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
