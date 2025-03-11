const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // 提供 Next.js 應用的路徑，以加載 next.config.js 和 .env 文件
  dir: './',
});

// 自定義 Jest 配置
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-node',  // 改為 node 環境
  moduleNameMapper: {
    // 處理模塊別名
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/tests/',  // 忽略 Playwright 測試
  ],
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
};

// createJestConfig 會自動處理一些配置，如 transform 和 moduleFileExtensions
module.exports = createJestConfig(customJestConfig);
