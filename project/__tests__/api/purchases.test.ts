import { NextRequest, NextResponse } from 'next/server';
import { GET, POST } from '@/app/api/purchases/route';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// 模擬 Prisma 和 getCurrentUser
jest.mock('@/lib/db', () => ({
  prisma: {
    purchaseOrder: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    product: {
      update: jest.fn(),
    },
    $transaction: jest.fn().mockImplementation(async (callback) => {
      if (typeof callback === 'function') {
        return await callback(prisma);
      }
      return await Promise.all(callback);
    }),
  },
}));

jest.mock('@/lib/auth', () => ({
  getCurrentUser: jest.fn(),
}));

// 確保 NextResponse 被正確模擬
jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: jest.fn().mockImplementation((data, options = {}) => {
        return {
          status: options.status || 200,
          headers: new Map(),
          json: async () => data,
        };
      }),
    },
    NextRequest: jest.fn().mockImplementation((url) => ({
      url: url || 'http://localhost/',
      method: 'GET',
      headers: new Map(),
      json: async () => ({}),
      text: async () => '',
      clone: () => ({ url: url || 'http://localhost/' }),
    })),
  };
});

describe('Purchases API Route', () => {
  // 獲取當前日期的字符串表示
  const currentDate = new Date().toISOString();
  
  // 模擬採購單數據
  const mockPurchases = [
    {
      id: '1',
      orderNumber: 'PO-001',
      status: 'PENDING', // 待簽收
      notes: '測試採購單',
      supplier: { id: '1', name: '測試供應商 1' },
      warehouse: { id: '1', name: '台北倉庫' },
      items: [
        {
          id: '1',
          quantity: 10,
          unitPrice: 100, // 採購單價格
          product: { 
            id: '1', 
            name: '測試產品 1', 
            sku: 'TEST-001',
            costPrice: 90, // 目前的成本價（尚未更新）
          },
        }
      ],
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      id: '2',
      orderNumber: 'PO-002',
      status: 'COMPLETED', // 已完成簽收
      notes: '測試採購單 2',
      supplier: { id: '2', name: '測試供應商 2' },
      warehouse: { id: '2', name: '高雄倉庫' },
      items: [
        {
          id: '2',
          quantity: 5,
          unitPrice: 150, // 採購單價格
          product: { 
            id: '2', 
            name: '測試產品 2', 
            sku: 'TEST-002',
            costPrice: 150, // 已更新的成本價
          },
        }
      ],
      createdAt: currentDate,
      updatedAt: currentDate,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('應該返回 401 當用戶未認證', async () => {
    // 模擬 getCurrentUser 返回 null（未認證）
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/purchases');
    const response = await GET(request);
    
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ error: 'Unauthorized' });
    expect(prisma.purchaseOrder.findMany).not.toHaveBeenCalled();
  });

  it('應該返回採購單列表當用戶已認證', async () => {
    // 模擬已認證用戶
    (getCurrentUser as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'MANAGER',
    });

    (prisma.purchaseOrder.findMany as jest.Mock).mockResolvedValue(mockPurchases);

    const request = new NextRequest('http://localhost:3000/api/purchases');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockPurchases);
    expect(prisma.purchaseOrder.findMany).toHaveBeenCalledWith({
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
  });

  it('應該處理錯誤並返回 500 狀態碼', async () => {
    // 模擬已認證用戶
    (getCurrentUser as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'MANAGER',
    });

    // 模擬數據庫錯誤
    (prisma.purchaseOrder.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3000/api/purchases');
    const response = await GET(request);
    
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({ error: 'Failed to fetch purchases' });
  });

  it('應該在採購單簽收確認後更新產品成本價', async () => {
    // 模擬 ADMIN 用戶（只有 ADMIN 可以確認採購單）
    (getCurrentUser as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN',
    });

    // 模擬待確認的採購單
    const pendingPurchaseOrder = {
      id: '1',
      orderNumber: 'PO-001',
      status: 'PENDING',
      items: [
        {
          id: '1',
          productId: '1',
          quantity: 10,
          unitPrice: 100, // 新的採購單價格
          product: {
            id: '1',
            name: '測試產品 1',
            costPrice: 90, // 舊的成本價
          }
        }
      ]
    };

    // 模擬確認後的採購單
    const confirmedPurchaseOrder = {
      ...pendingPurchaseOrder,
      status: 'COMPLETED',
    };

    // 模擬更新後的產品
    const updatedProduct = {
      id: '1',
      name: '測試產品 1',
      costPrice: 100, // 更新後的成本價（與採購單價格一致）
    };

    // 模擬 API 請求數據
    const requestBody = {
      id: '1',
      status: 'COMPLETED',
    };

    // 模擬 Prisma 方法
    (prisma.purchaseOrder.update as jest.Mock).mockResolvedValue(confirmedPurchaseOrder);
    (prisma.product.update as jest.Mock).mockResolvedValue(updatedProduct);

    // 創建 POST 請求
    const request = new NextRequest('http://localhost:3000/api/purchases/confirm', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    // 呼叫 API 路由
    const response = await POST(request);
    
    // 驗證響應
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(confirmedPurchaseOrder);

    // 驗證採購單狀態更新
    expect(prisma.purchaseOrder.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { status: 'COMPLETED' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // 驗證產品成本價更新
    expect(prisma.product.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { costPrice: 100 },
    });
  });

  it('應該只允許 ADMIN 確認採購單', async () => {
    // 模擬 MANAGER 用戶（不應該有權限確認採購單）
    (getCurrentUser as jest.Mock).mockResolvedValue({
      id: '2',
      name: 'Manager User',
      email: 'manager@example.com',
      role: 'MANAGER',
    });

    // 模擬 API 請求數據
    const requestBody = {
      id: '1',
      status: 'COMPLETED',
    };

    // 創建 POST 請求
    const request = new NextRequest('http://localhost:3000/api/purchases/confirm', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    // 呼叫 API 路由
    const response = await POST(request);
    
    // 驗證響應（應該返回 403 Forbidden）
    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data).toEqual({ error: 'Only ADMIN can confirm purchase orders' });

    // 驗證採購單和產品未被更新
    expect(prisma.purchaseOrder.update).not.toHaveBeenCalled();
    expect(prisma.product.update).not.toHaveBeenCalled();
  });
});
