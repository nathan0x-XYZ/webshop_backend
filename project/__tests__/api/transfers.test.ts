import { NextRequest } from 'next/server';
import { GET } from '@/app/api/transfers/route';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// 模擬 Prisma 和 getCurrentUser
jest.mock('@/lib/db', () => ({
  prisma: {
    transferOrder: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock('@/lib/auth', () => ({
  getCurrentUser: jest.fn(),
}));

describe('Transfers API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('應該返回 401 當用戶未認證', async () => {
    // 模擬 getCurrentUser 返回 null（未認證）
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/transfers');
    const response = await GET(request);
    
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ error: 'Unauthorized' });
    expect(prisma.transferOrder.findMany).not.toHaveBeenCalled();
  });

  it('應該返回調撥單列表當用戶已認證', async () => {
    // 模擬已認證用戶
    (getCurrentUser as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'MANAGER',
    });

    // 模擬調撥單數據
    const mockTransfers = [
      {
        id: '1',
        orderNumber: 'TR-001',
        status: 'PENDING',
        notes: '測試調撥單',
        sourceWarehouse: { id: '1', name: '台北倉庫' },
        destinationWarehouse: { id: '2', name: '高雄倉庫' },
        items: [
          {
            id: '1',
            quantity: 10,
            product: { id: '1', name: '測試產品 1', sku: 'TEST-001' },
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        orderNumber: 'TR-002',
        status: 'COMPLETED',
        notes: '測試調撥單 2',
        sourceWarehouse: { id: '2', name: '高雄倉庫' },
        destinationWarehouse: { id: '1', name: '台北倉庫' },
        items: [
          {
            id: '2',
            quantity: 5,
            product: { id: '2', name: '測試產品 2', sku: 'TEST-002' },
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (prisma.transferOrder.findMany as jest.Mock).mockResolvedValue(mockTransfers);

    const request = new NextRequest('http://localhost:3000/api/transfers');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockTransfers);
    expect(prisma.transferOrder.findMany).toHaveBeenCalledWith({
      include: {
        sourceWarehouse: true,
        destinationWarehouse: true,
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
    (prisma.transferOrder.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3000/api/transfers');
    const response = await GET(request);
    
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({ error: 'Failed to fetch transfers' });
  });
});
