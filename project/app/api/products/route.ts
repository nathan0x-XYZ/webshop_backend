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

    // 從數據庫獲取所有產品
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // 根據用戶角色處理成本價可見性
    // 只有 ADMIN 用戶可以看到成本價
    if (user.role !== 'ADMIN') {
      // 對於非 ADMIN 用戶，移除所有產品的成本價
      const productsWithoutCostPrice = products.map(product => {
        const { costPrice, ...productWithoutCostPrice } = product;
        return productWithoutCostPrice;
      });
      return NextResponse.json(productsWithoutCostPrice);
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("獲取產品時出錯:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
