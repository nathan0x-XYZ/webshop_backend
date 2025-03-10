#!/bin/bash

# 輸出調試信息
echo "Starting Vercel deployment script..."
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Working directory: $(pwd)"
echo "Environment: $VERCEL_ENV"

# 設置環境變量
export IS_WEBCONTAINER=false
export NODE_ENV=production

# 生成 Prisma 客戶端
echo "Generating Prisma client..."
npx prisma generate

# 嘗試執行 Prisma 部署腳本，但不讓它阻止構建
echo "Running Prisma deploy script..."
node -e "try { require('./prisma/vercel-deploy.js') } catch (e) { console.error('Prisma deploy script failed, but continuing build:', e.message) }"

# 構建 Next.js 應用
echo "Building Next.js application..."
next build

echo "Vercel deployment script completed."
