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
  
  // 環境變量
  env: {
    IS_WEBCONTAINER: process.env.IS_WEBCONTAINER || 'false',
  },

  // 禁用 image optimization，避免可能的問題
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig