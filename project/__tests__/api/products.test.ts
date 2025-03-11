import { NextRequest } from 'next/server';
import { GET } from '@/app/api/products/route';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// 模擬 Prisma 和 getCurrentUser
jest.mock('@/lib/db', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock('@/lib/auth', () => ({
  getCurrentUser: jest.fn(),
}));

describe('Products API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('應該返回 401 當用戶未認證', async () => {
    // 模擬 getCurrentUser 返回 null（未認證）
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/products');
    const response = await GET(request);
    
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ error: 'Unauthorized' });
    expect(prisma.product.findMany).not.toHaveBeenCalled();
  });

  it('應該返回產品列表當用戶已認證', async () => {
    // 模擬已認證用戶
    (getCurrentUser as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'MANAGER',
    });

    // 模擬產品數據
    const mockProducts = [
      {
        id: '1',
        name: '測試產品 1',
        sku: 'TEST-001',
        description: '測試描述',
        costPrice: 100,
        sellingPrice: 200,
        category: { id: '1', name: '測試分類' },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: '測試產品 2',
        sku: 'TEST-002',
        description: '測試描述 2',
        costPrice: 150,
        sellingPrice: 300,
        category: { id: '1', name: '測試分類' },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

    const request = new NextRequest('http://localhost:3000/api/products');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockProducts);
    expect(prisma.product.findMany).toHaveBeenCalledWith({
      include: {
        category: true,
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
    (prisma.product.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3000/api/products');
    const response = await GET(request);
    
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({ error: 'Failed to fetch products' });
  });
});
