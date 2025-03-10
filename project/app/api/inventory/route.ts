import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // 獲取查詢參數
    const url = new URL(request.url);
    const productId = url.searchParams.get("productId");
    const warehouseId = url.searchParams.get("warehouseId");
    
    // 如果沒有提供產品ID或倉庫ID，返回錯誤
    if (!productId || !warehouseId) {
      return NextResponse.json(
        { message: "Product ID and Warehouse ID are required" },
        { status: 400 }
      );
    }
    
    // 查詢庫存
    const inventoryItem = await prisma.inventoryItem.findUnique({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
      },
      include: {
        product: true,
        warehouse: true,
      },
    });
    
    // 如果沒有找到庫存記錄，返回數量為0
    if (!inventoryItem) {
      return NextResponse.json({
        productId,
        warehouseId,
        quantity: 0,
        product: null,
        warehouse: null,
      });
    }
    
    return NextResponse.json(inventoryItem);
  } catch (error) {
    console.error("Error checking inventory:", error);
    return NextResponse.json(
      { message: "Failed to check inventory" },
      { status: 500 }
    );
  }
}
