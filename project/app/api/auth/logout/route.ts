import { NextResponse } from "next/server";

export async function POST() {
  // With localStorage-based auth, we don't need to clear cookies on the server
  // The client will handle removing the token from localStorage
  return NextResponse.json({ success: true });
}

// Add dynamic export to fix the error
export const dynamic = 'force-dynamic';