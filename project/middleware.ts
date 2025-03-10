import { NextResponse } from "next/server";

// Paths that don't require authentication
const publicPaths = ["/", "/login"];

// 簡化的中間件，不使用任何不支持的模塊
export function middleware() {
  return NextResponse.next();
}

// 完全禁用 matcher，不攔截任何請求
export const config = {
  matcher: [],
};