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

    // 從數據庫獲取所有採購單
    const purchases = await prisma.purchaseOrder.findMany({
      include: {
        supplier: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(purchases);
  } catch (error) {
    console.error("獲取採購單時出錯:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchases" },
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

    // 只有 ADMIN 角色可以確認採購單
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Only ADMIN can confirm purchase orders" },
        { status: 403 }
      );
    }

    // 解析請求數據
    const data = await request.json();
    const { id, status } = data;

    if (!id || status !== 'COMPLETED') {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // 使用事務處理來確保數據一致性
    const result = await prisma.$transaction(async (tx) => {
      // 更新採購單狀態
      const updatedPurchaseOrder = await tx.purchaseOrder.update({
        where: { id },
        data: { status },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // 如果採購單已確認，更新相關產品的成本價
      if (status === 'COMPLETED') {
        for (const item of updatedPurchaseOrder.items) {
          await tx.product.update({
            where: { id: item.product.id },
            data: { costPrice: item.unitPrice },
          });
        }
      }

      return updatedPurchaseOrder;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("確認採購單時出錯:", error);
    return NextResponse.json(
      { error: "Failed to confirm purchase order" },
      { status: 500 }
    );
  }
}
