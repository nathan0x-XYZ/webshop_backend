/** @type {import('next').NextConfig} */
const nextConfig = {
  // 確保沒有 output: 'export' 以允許 API 路由運行
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // 添加環境變量配置
  env: {
    IS_WEBCONTAINER: true,
    JWT_SECRET: 'fashion-inventory-jwt-secret-key',
  },
};

module.exports = nextConfig;