import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // 驗證用戶
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 從數據庫獲取所有供應商
    const suppliers = await prisma.supplier.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(suppliers);
  } catch (error) {
    console.error("獲取供應商時出錯:", error);
    return NextResponse.json(
      { error: "Failed to fetch suppliers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 驗證用戶
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 檢查用戶權限（只有 ADMIN 和 MANAGER 可以創建供應商）
    if (user.role !== "ADMIN" && user.role !== "MANAGER") {
      return NextResponse.json(
        { error: "Permission denied" },
        { status: 403 }
      );
    }

    // 解析請求體
    const data = await request.json();

    // 創建新供應商
    const supplier = await prisma.supplier.create({
      data: {
        name: data.name,
        contactName: data.contactName || null,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        createdById: user.id,
        updatedById: user.id,
      },
    });

    return NextResponse.json(supplier, { status: 201 });
  } catch (error) {
    console.error("創建供應商時出錯:", error);
    return NextResponse.json(
      { error: "Failed to create supplier" },
      { status: 500 }
    );
  }
}
