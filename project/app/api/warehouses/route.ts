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

    // 從數據庫獲取所有倉庫
    const warehouses = await prisma.warehouse.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(warehouses);
  } catch (error) {
    console.error("獲取倉庫時出錯:", error);
    return NextResponse.json(
      { error: "Failed to fetch warehouses" },
      { status: 500 }
    );
  }
}
