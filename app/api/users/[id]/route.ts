import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { UpdateUserData } from "@/lib/types/user";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Check if user is admin
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: currentUser } = await supabase
      .from("users")
      .select("role")
      .eq("auth_user_id", authUser.id)
      .single();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body: UpdateUserData = await request.json();
    const { id } = params;

    // Check if user is admin - prevent deactivating admins
    const { data: targetUser } = await supabase
      .from("users")
      .select("role")
      .eq("id", id)
      .single();

    if (targetUser?.role === 'admin' && body.is_active === false) {
      return NextResponse.json(
        { error: "Cannot deactivate admin users" },
        { status: 400 }
      );
    }

    // Update user
    const { data: updatedUser, error } = await supabase
      .from("users")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Check if user is admin
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: currentUser } = await supabase
      .from("users")
      .select("role")
      .eq("auth_user_id", authUser.id)
      .single();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = params;

    // Check if user is admin - prevent deleting admins
    const { data: targetUser } = await supabase
      .from("users")
      .select("role, auth_user_id")
      .eq("id", id)
      .single();

    if (targetUser?.role === 'admin') {
      return NextResponse.json(
        { error: "Cannot delete admin users" },
        { status: 400 }
      );
    }

    // Get user to delete their auth account
    const userToDelete = targetUser;

    // Delete user profile
    const { error: profileError } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (profileError) {
      throw profileError;
    }

    // Delete auth user if exists using admin client
    if (userToDelete?.auth_user_id) {
      const adminClient = createAdminClient();
      await adminClient.auth.admin.deleteUser(userToDelete.auth_user_id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete user" },
      { status: 500 }
    );
  }
}
