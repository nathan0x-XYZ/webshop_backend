import { NextRequest, NextResponse } from 'next/server';
import { GET } from '@/app/api/inventory-audits/route';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// 模擬 Prisma 和 getCurrentUser
jest.mock('@/lib/db', () => ({
  prisma: {
    inventoryAudit: {
      findMany: jest.fn(),
    },
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

describe('Inventory Audits API Route', () => {
  // 獲取當前日期的字符串表示
  const currentDate = new Date().toISOString();
  
  // 模擬庫存盤點單數據
  const mockAudits = [
    {
      id: '1',
      auditNumber: 'IA-001',
      status: 'PENDING',
      notes: '測試庫存稽核',
      warehouse: { id: '1', name: '台北倉庫' },
      items: [
        {
          id: '1',
          product: { id: '1', name: '測試產品 1', sku: 'TEST-001' },
          expectedQuantity: 100,
          actualQuantity: 95,
          discrepancy: -5,
        },
      ],
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      id: '2',
      auditNumber: 'IA-002',
      status: 'COMPLETED',
      notes: '測試庫存稽核 2',
      warehouse: { id: '2', name: '高雄倉庫' },
      items: [
        {
          id: '2',
          product: { id: '2', name: '測試產品 2', sku: 'TEST-002' },
          expectedQuantity: 50,
          actualQuantity: 52,
          discrepancy: 2,
        },
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

    const request = new NextRequest('http://localhost:3000/api/inventory-audits');
    const response = await GET(request);
    
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ error: 'Unauthorized' });
    expect(prisma.inventoryAudit.findMany).not.toHaveBeenCalled();
  });

  it('應該返回庫存稽核列表當用戶已認證', async () => {
    // 模擬已認證用戶
    (getCurrentUser as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'MANAGER',
    });

    (prisma.inventoryAudit.findMany as jest.Mock).mockResolvedValue(mockAudits);

    const request = new NextRequest('http://localhost:3000/api/inventory-audits');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockAudits);
    expect(prisma.inventoryAudit.findMany).toHaveBeenCalledWith({
      include: {
        warehouse: true,
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
    (prisma.inventoryAudit.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3000/api/inventory-audits');
    const response = await GET(request);
    
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({ error: 'Failed to fetch inventory audits' });
  });
});
