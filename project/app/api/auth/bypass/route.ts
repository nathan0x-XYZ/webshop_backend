import { NextRequest, NextResponse } from "next/server";
import { signJWT } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    console.log("Bypass auth API called");
    
    // Create a test admin user
    const userData = {
      id: "test-admin-id",
      email: "admin@example.com",
      name: "Test Admin",
      role: "ADMIN",
    };
    
    // Create JWT token
    const token = await signJWT(userData);
    console.log("Bypass auth: JWT token created successfully");
    
    // Return token in response
    return NextResponse.json({
      token,
      user: userData,
      message: "This is a temporary bypass for testing purposes only"
    });
  } catch (error) {
    console.error("Bypass auth API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Add dynamic export to fix the error
export const dynamic = 'force-dynamic';
