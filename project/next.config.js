/** @type {import('next').NextConfig} */
const nextConfig = {
  // 禁用 React 嚴格模式
  reactStrictMode: false,
  
  // 禁用 TypeScript 類型檢查
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 禁用 ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // 使用標準輸出
  output: 'standalone',
  
  // 環境變量
  env: {
    IS_WEBCONTAINER: process.env.IS_WEBCONTAINER || 'false',
  },
}

module.exports = nextConfig