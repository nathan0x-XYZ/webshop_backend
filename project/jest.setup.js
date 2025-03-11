// 導入 jest-dom 擴展
import '@testing-library/jest-dom';

// 模擬 Next.js 的 useRouter
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
  }),
}));

// 模擬 next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// 全局設置
global.fetch = jest.fn();

// 模擬 next/server 中的 NextRequest 和 NextResponse
jest.mock('next/server', () => {
  const mockNextResponse = {
    json: jest.fn().mockImplementation((data) => ({
      status: 200,
      json: jest.fn().mockResolvedValue(data),
    })),
    redirect: jest.fn(),
    rewrite: jest.fn(),
    next: jest.fn(),
  };

  return {
    NextResponse: {
      json: jest.fn().mockImplementation((data, options = {}) => {
        return {
          status: options.status || 200,
          headers: new Map(),
          json: async () => data,
        };
      }),
      redirect: jest.fn(),
      rewrite: jest.fn(),
      next: jest.fn(),
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

// 清理所有模擬
afterEach(() => {
  jest.clearAllMocks();
});
