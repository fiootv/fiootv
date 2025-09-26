"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Plus, Edit, Trash2, Shield, UserCheck } from "lucide-react";
import Link from "next/link";
import { User as UserType, UserRole } from "@/lib/types/user";
import { AdminGuard } from "@/components/admin-guard";

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch users");
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete user");
      }
      
      // Refresh the users list
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      setError(error instanceof Error ? error.message : "Failed to delete user");
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user");
      }
      
      // Refresh the users list
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      setError(error instanceof Error ? error.message : "Failed to update user");
    }
  };

  const getRoleIcon = (role: UserRole) => {
    return role === "admin" ? (
      <Shield className="w-4 h-4" />
    ) : (
      <UserCheck className="w-4 h-4" />
    );
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    return role === "admin" ? "default" : "secondary";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Agents</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400">Loading agents...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Agents</h1>
          <p className="text-gray-400 mt-2">Manage agent accounts</p>
        </div>
          <Link href="/dashboard/users/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Agent
            </Button>
          </Link>
        </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {users.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No agents found</h3>
            <p className="text-gray-400 text-center mb-6">
              Get started by adding your first agent account.
            </p>
            <Link href="/dashboard/users/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Agent
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {users.map((user) => (
            <Card key={user.id} className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                      {getRoleIcon(user.role)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {user.full_name || user.email}
                      </h3>
                      <p className="text-gray-400">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          variant={getRoleBadgeVariant(user.role)}
                          className="text-xs"
                        >
                          {user.role}
                        </Badge>
                        <Badge 
                          variant={user.is_active ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </Badge>
                        {user.role === 'admin' && (
                          <Badge 
                            variant="outline"
                            className="text-xs border-yellow-500/50 text-yellow-400"
                          >
                            Protected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {user.role !== 'admin' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(user.id, user.is_active)}
                        className="border-slate-700 text-slate-300 hover:bg-slate-700"
                      >
                        {user.is_active ? "Deactivate" : "Activate"}
                      </Button>
                    )}
                    {user.role !== 'admin' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="border-red-500/50 text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                    <div>
                      <span className="font-medium">Created:</span>{" "}
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Last Login:</span>{" "}
                      {user.last_login 
                        ? new Date(user.last_login).toLocaleDateString()
                        : "Never"
                      }
                    </div>
                    <div>
                      <span className="font-medium">Created By:</span>{" "}
                      {user.creator?.full_name || user.creator?.email || "System"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </AdminGuard>
  );
}
