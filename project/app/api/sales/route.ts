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
    
    // 獲取所有銷售訂單
    const salesOrders = await prisma.salesOrder.findMany({
      include: {
        warehouse: {
          select: {
            name: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                sku: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    // 格式化響應數據
    const formattedOrders = salesOrders.map((order) => {
      const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        id: order.id,
        salesNumber: order.salesNumber,
        warehouse: order.warehouse.name,
        warehouseId: order.warehouseId,
        status: order.status,
        salesDate: order.salesDate,
        customerName: order.customerName || "Walk-in Customer",
        customerContact: order.customerContact,
        notes: order.notes,
        totalAmount: order.totalAmount,
        totalItems,
        createdBy: order.createdBy.name,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };
    });
    
    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching sales orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch sales orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const data = await request.json();
    
    // 驗證必要字段
    if (!data.warehouseId) {
      return NextResponse.json(
        { message: "Warehouse is required" },
        { status: 400 }
      );
    }
    
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json(
        { message: "At least one product is required" },
        { status: 400 }
      );
    }
    
    // 生成訂單編號
    const salesCount = await prisma.salesOrder.count();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const salesNumber = `SO-${year}${month}-${String(salesCount + 1).padStart(4, '0')}`;
    
    // 開始事務處理
    const result = await prisma.$transaction(async (tx) => {
      // 檢查每個商品的庫存
      for (const item of data.items) {
        const inventory = await tx.inventoryItem.findUnique({
          where: {
            productId_warehouseId: {
              productId: item.productId,
              warehouseId: data.warehouseId,
            },
          },
        });
        
        // 如果庫存不存在或不足，拋出錯誤
        if (!inventory) {
          throw new Error(`Product ${item.productId} is not available in the selected warehouse`);
        }
        
        if (inventory.quantity < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId}. Available: ${inventory.quantity}, Requested: ${item.quantity}`);
        }
      }
      
      // 創建銷售訂單
      const salesOrder = await tx.salesOrder.create({
        data: {
          salesNumber,
          warehouseId: data.warehouseId,
          status: "COMPLETED", // 默認為已完成
          customerName: data.customerName,
          customerContact: data.customerContact,
          notes: data.notes,
          totalAmount: data.totalAmount,
          createdById: userId,
          updatedById: userId,
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
      });
      
      // 更新庫存
      for (const item of data.items) {
        await tx.inventoryItem.update({
          where: {
            productId_warehouseId: {
              productId: item.productId,
              warehouseId: data.warehouseId,
            },
          },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }
      
      return salesOrder;
    });
    
    return NextResponse.json({
      id: result.id,
      salesNumber: result.salesNumber,
      message: "Sales order created successfully",
    });
  } catch (error) {
    console.error("Error creating sales order:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create sales order" },
      { status: 500 }
    );
  }
}
