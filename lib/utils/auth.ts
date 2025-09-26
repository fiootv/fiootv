import { createClient } from "@/lib/supabase/server";
import { User, UserRole } from "@/lib/types/user";

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth_user_id", authUser.id)
    .single();

  if (error || !user) return null;
  return user;
}

export async function getUserRole(): Promise<UserRole | null> {
  const user = await getCurrentUser();
  return user?.role || null;
}

export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole();
  return role === "admin";
}

export async function isAgent(): Promise<boolean> {
  const role = await getUserRole();
  return role === "agent";
}

export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const role = await getUserRole();
  return role === requiredRole;
}

export async function requireRole(requiredRole: UserRole): Promise<User> {
  const user = await getCurrentUser();
  if (!user || user.role !== requiredRole) {
    throw new Error(`Access denied. Required role: ${requiredRole}`);
  }
  return user;
}

export async function requireAdmin(): Promise<User> {
  return requireRole("admin");
}
