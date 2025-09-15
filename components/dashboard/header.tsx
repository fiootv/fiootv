"use client";

import { User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface HeaderProps {
  onMenuClick: () => void;
}

interface UserData {
  email: string;
  name?: string;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserData({
            email: user.email || '',
            name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [supabase.auth]);

  return (
    <header className="bg-slate-900 border-b border-gray-800 px-6 py-4">
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
        
        {/* Spacer for mobile menu button */}
        <div className="flex-1" />
        
        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:block">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-700 rounded w-32"></div>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-white">
                  {userData?.name || 'User'}
                </p>
                <p className="text-xs text-gray-400">
                  {userData?.email || 'user@example.com'}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
