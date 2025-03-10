import { NextRequest, NextResponse } from "next/server";

// Paths that don't require authentication
const publicPaths = ["/", "/login"];

export async function middleware(request: NextRequest) {
  // 完全禁用 middleware，允許所有請求通過
  return NextResponse.next();
}

// 完全禁用 matcher，不攔截任何請求
export const config = {
  matcher: [],
};