import { NextRequest, NextResponse } from 'next/server';
import { GET } from '@/app/api/suppliers/route';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// 模擬 Prisma 和 getCurrentUser
jest.mock('@/lib/db', () => ({
  prisma: {
    supplier: {
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

describe('Suppliers API Route', () => {
  // 獲取當前日期的字符串表示
  const currentDate = new Date().toISOString();
  
  // 模擬供應商數據
  const mockSuppliers = [
    {
      id: '1',
      name: '測試供應商 1',
      contactPerson: '張三',
      contactPhone: '0912345678',
      contactEmail: 'zhangsan@example.com',
      address: '台北市信義區101號',
      isActive: true,
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      id: '2',
      name: '測試供應商 2',
      contactPerson: '李四',
      contactPhone: '0987654321',
      contactEmail: 'lisi@example.com',
      address: '高雄市前鎮區123號',
      isActive: true,
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

    const request = new NextRequest('http://localhost:3000/api/suppliers');
    const response = await GET(request);
    
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ error: 'Unauthorized' });
    expect(prisma.supplier.findMany).not.toHaveBeenCalled();
  });

  it('應該返回供應商列表當用戶已認證', async () => {
    // 模擬已認證用戶
    (getCurrentUser as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'MANAGER',
    });

    (prisma.supplier.findMany as jest.Mock).mockResolvedValue(mockSuppliers);

    const request = new NextRequest('http://localhost:3000/api/suppliers');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockSuppliers);
    expect(prisma.supplier.findMany).toHaveBeenCalledWith({
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
    (prisma.supplier.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3000/api/suppliers');
    const response = await GET(request);
    
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({ error: 'Failed to fetch suppliers' });
  });
});
