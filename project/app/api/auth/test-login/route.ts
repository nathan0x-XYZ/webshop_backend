import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { UserRole } from "@prisma/client";
import { auth } from "@/lib/auth";

// 測試登入 API 端點
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role } = body;
    
    // 根據請求的角色創建測試用戶
    let userRole = UserRole.MANAGER; // 默認為 MANAGER
    
    if (role === "ADMIN") {
      userRole = UserRole.ADMIN;
    } else if (role === "STAFF") {
      userRole = UserRole.STAFF;
    }
    
    // 創建測試用戶
    const testUser = {
      id: `test-${userRole.toLowerCase()}-id`,
      email: `${userRole.toLowerCase()}@example.com`,
      name: `Test ${userRole}`,
      role: userRole,
    };
    
    // 簽發 JWT token
    const token = await auth.signJWT(testUser);
    
    // 設置 cookie
    const cookieStore = cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    return NextResponse.json({ 
      success: true, 
      message: `已成功以 ${userRole} 角色登入`,
      user: testUser
    });
  } catch (error) {
    console.error("測試登入失敗:", error);
    return NextResponse.json(
      { success: false, message: "測試登入失敗" },
      { status: 500 }
    );
  }
}
