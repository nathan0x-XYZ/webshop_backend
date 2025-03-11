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

    // 從數據庫獲取所有產品
    const products = await db.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("獲取產品時出錯:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
