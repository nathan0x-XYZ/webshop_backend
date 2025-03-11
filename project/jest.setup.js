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

// 清理所有模擬
afterEach(() => {
  jest.clearAllMocks();
});
