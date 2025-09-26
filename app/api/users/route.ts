import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { CreateUserData } from "@/lib/types/user";

export async function GET() {
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

    // Fetch all users
    const { data: users, error } = await supabase
      .from("users")
      .select(`
        *,
        creator:created_by(
          id,
          full_name,
          email
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check if user is admin
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: currentUser } = await supabase
      .from("users")
      .select("id, role")
      .eq("auth_user_id", authUser.id)
      .single();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body: CreateUserData = await request.json();
    const { email, full_name, role, password } = body;

    // Use admin client for user creation
    const adminClient = createAdminClient();

    // Create auth user using admin client
    const { data: newAuthUser, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        full_name,
      },
      email_confirm: true,
    });

    if (authError) {
      console.error("Auth user creation error:", authError);
      throw new Error(`Agent creation failed: ${authError.message}`);
    }

    if (!newAuthUser.user) {
      throw new Error("Failed to create auth user - no user returned");
    }

    console.log("Auth user created successfully:", newAuthUser.user.id);

    // Create user profile using admin client
    const { data: userProfile, error: profileError } = await adminClient
      .from("users")
      .insert({
        auth_user_id: newAuthUser.user.id,
        email,
        full_name,
        role,
        created_by: currentUser.id, // Use currentUser.id instead of authUser.id
      })
      .select()
      .single();

    if (profileError) {
      console.error("User profile creation error:", profileError);
      throw new Error(`Profile creation failed: ${profileError.message}`);
    }

    console.log("User profile created successfully:", userProfile.id);

    return NextResponse.json({ user: userProfile });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create user" },
      { status: 500 }
    );
  }
}
