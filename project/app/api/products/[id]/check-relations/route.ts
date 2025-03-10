import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const productId = params.id;
    
    // 檢查產品是否有關聯的採購項目
    const purchaseItems = await prisma.purchaseItem.findFirst({
      where: { productId },
    });
    
    // 檢查產品是否有關聯的銷售項目
    const salesItems = await prisma.salesItem.findFirst({
      where: { productId },
    });
    
    // 檢查產品是否有關聯的調撥項目
    const transferItems = await prisma.transferItem.findFirst({
      where: { productId },
    });
    
    // 檢查產品是否有關聯的盤點項目
    const auditItems = await prisma.auditItem.findFirst({
      where: { productId },
    });
    
    const hasRelations = !!(purchaseItems || salesItems || transferItems || auditItems);
    
    return NextResponse.json({ hasRelations });
  } catch (error) {
    console.error("Error checking product relations:", error);
    return NextResponse.json(
      { message: "Failed to check product relations" },
      { status: 500 }
    );
  }
}
