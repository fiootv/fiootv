"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <button
      onClick={logout}
      className="flex items-center space-x-3 text-gray-400 text-sm hover:text-white hover:bg-gray-800 w-full px-3 py-2 rounded-lg transition-colors"
    >
      <LogOut className="w-4 h-4" />
      <span>Logout</span>
    </button>
  );
}
