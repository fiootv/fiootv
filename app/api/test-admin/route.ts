import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test admin client creation
    const adminClient = createAdminClient();
    
    // Test basic connection
    const { data, error } = await adminClient
      .from("users")
      .select("count")
      .limit(1);

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: "Failed to query users table"
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Admin client is working correctly",
      canQueryUsers: true
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error",
      details: "Failed to create admin client or query database"
    });
  }
}
