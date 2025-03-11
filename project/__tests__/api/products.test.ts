import { NextRequest, NextResponse } from 'next/server';
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

describe('Products API Route', () => {
  // 獲取當前日期的字符串表示
  const currentDate = new Date().toISOString();
  
  // 模擬產品數據
  const mockProducts = [
    {
      id: '1',
      name: '測試產品 1',
      sku: 'TEST-001',
      description: '測試描述',
      costPrice: 100, // 成本價
      sellingPrice: 200,
      category: { id: '1', name: '測試分類' },
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      id: '2',
      name: '測試產品 2',
      sku: 'TEST-002',
      description: '測試描述 2',
      costPrice: 150, // 成本價
      sellingPrice: 300,
      category: { id: '1', name: '測試分類' },
      createdAt: currentDate,
      updatedAt: currentDate,
    },
  ];

  // 預期 ADMIN 角色可以看到的產品數據（包含成本價）
  const expectedProductsForAdmin = [...mockProducts];

  // 預期 MANAGER 和 STAFF 角色可以看到的產品數據（不包含成本價）
  const expectedProductsForNonAdmin = mockProducts.map(product => {
    const { costPrice, ...rest } = product;
    return rest;
  });

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

  it('應該返回包含成本價的產品列表當用戶是 ADMIN', async () => {
    // 模擬 ADMIN 用戶
    (getCurrentUser as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN',
    });

    (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

    const request = new NextRequest('http://localhost:3000/api/products');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    
    // 驗證 ADMIN 可以看到成本價
    expect(data).toEqual(expectedProductsForAdmin);
    expect(data[0]).toHaveProperty('costPrice');
    expect(data[1]).toHaveProperty('costPrice');
    
    expect(prisma.product.findMany).toHaveBeenCalledWith({
      include: {
        category: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  });

  it('應該返回不包含成本價的產品列表當用戶是 MANAGER', async () => {
    // 模擬 MANAGER 用戶
    (getCurrentUser as jest.Mock).mockResolvedValue({
      id: '2',
      name: 'Manager User',
      email: 'manager@example.com',
      role: 'MANAGER',
    });

    (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

    const request = new NextRequest('http://localhost:3000/api/products');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    
    // 驗證 MANAGER 不能看到成本價
    expect(data).toEqual(expectedProductsForNonAdmin);
    expect(data[0]).not.toHaveProperty('costPrice');
    expect(data[1]).not.toHaveProperty('costPrice');
    
    expect(prisma.product.findMany).toHaveBeenCalledWith({
      include: {
        category: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  });

  it('應該返回不包含成本價的產品列表當用戶是 STAFF', async () => {
    // 模擬 STAFF 用戶
    (getCurrentUser as jest.Mock).mockResolvedValue({
      id: '3',
      name: 'Staff User',
      email: 'staff@example.com',
      role: 'STAFF',
    });

    (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

    const request = new NextRequest('http://localhost:3000/api/products');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    
    // 驗證 STAFF 不能看到成本價
    expect(data).toEqual(expectedProductsForNonAdmin);
    expect(data[0]).not.toHaveProperty('costPrice');
    expect(data[1]).not.toHaveProperty('costPrice');
    
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
