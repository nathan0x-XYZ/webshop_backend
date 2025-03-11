import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
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

    // 從數據庫獲取所有庫存盤點單
    const inventoryAudits = await db.inventoryAudit.findMany({
      include: {
        warehouse: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(inventoryAudits);
  } catch (error) {
    console.error("獲取庫存盤點單時出錯:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory audits" },
      { status: 500 }
    );
  }
}
