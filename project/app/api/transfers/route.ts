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

    // 從數據庫獲取所有調撥單
    const transfers = await db.transfer.findMany({
      include: {
        sourceWarehouse: true,
        destinationWarehouse: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(transfers);
  } catch (error) {
    console.error("獲取調撥單時出錯:", error);
    return NextResponse.json(
      { error: "Failed to fetch transfers" },
      { status: 500 }
    );
  }
}
