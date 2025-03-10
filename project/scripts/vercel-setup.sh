#!/bin/bash
# Vercel數據庫設置和遷移腳本

# 顏色設置
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== 時尚庫存管理系統 - Vercel部署助手 ===${NC}"
echo -e "${BLUE}此腳本將幫助您設置Vercel環境並遷移數據庫${NC}"
echo ""

# 檢查必要工具
echo -e "${BLUE}檢查必要工具...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}錯誤: npm未安裝${NC}"
    echo "請先安裝Node.js和npm: https://nodejs.org/"
    exit 1
fi

if ! command -v npx &> /dev/null; then
    echo -e "${RED}錯誤: npx未安裝${NC}"
    echo "請更新您的npm版本或單獨安裝npx"
    exit 1
fi

# 安裝Vercel CLI
echo -e "${BLUE}安裝Vercel CLI...${NC}"
npm install -g vercel

# 登錄Vercel
echo -e "${BLUE}登錄Vercel...${NC}"
echo "如果您尚未登錄Vercel，請按照提示進行登錄"
vercel login

# 創建臨時環境文件
echo -e "${BLUE}創建臨時環境文件...${NC}"
cp .env .env.migration

# 提示用戶輸入雲端數據庫連接字符串
echo -e "${BLUE}請輸入您的雲端數據庫連接字符串:${NC}"
read -p "DATABASE_URL=" DB_URL

# 更新臨時環境文件
echo -e "${BLUE}更新臨時環境文件...${NC}"
sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"$DB_URL\"|g" .env.migration

# 安裝dotenv-cli
echo -e "${BLUE}安裝dotenv-cli...${NC}"
npm install -g dotenv-cli

# 創建遷移
echo -e "${BLUE}創建數據庫遷移...${NC}"
npx dotenv -e .env.migration -- prisma migrate dev --name init

# 部署遷移
echo -e "${BLUE}部署遷移到生產環境...${NC}"
npx dotenv -e .env.migration -- prisma migrate deploy

# 詢問是否需要遷移數據
echo -e "${BLUE}是否需要遷移現有數據? (y/n)${NC}"
read -p "" MIGRATE_DATA

if [ "$MIGRATE_DATA" = "y" ] || [ "$MIGRATE_DATA" = "Y" ]; then
    echo -e "${BLUE}執行數據種子腳本...${NC}"
    npx dotenv -e .env.migration -- prisma db seed
fi

# 設置Vercel環境變數
echo -e "${BLUE}設置Vercel環境變數...${NC}"
echo "請按照提示設置DATABASE_URL環境變數"
vercel env add DATABASE_URL

echo "請輸入JWT密鑰用於身份驗證"
read -p "JWT_SECRET=" JWT_SECRET
vercel env add JWT_SECRET

# 部署到Vercel
echo -e "${BLUE}是否立即部署到Vercel? (y/n)${NC}"
read -p "" DEPLOY_NOW

if [ "$DEPLOY_NOW" = "y" ] || [ "$DEPLOY_NOW" = "Y" ]; then
    echo -e "${BLUE}部署到Vercel...${NC}"
    vercel --prod
    echo -e "${GREEN}部署完成!${NC}"
else
    echo -e "${BLUE}您可以稍後使用以下命令部署:${NC}"
    echo "vercel --prod"
fi

# 清理
echo -e "${BLUE}清理臨時文件...${NC}"
rm .env.migration

echo -e "${GREEN}設置完成!${NC}"
echo -e "${BLUE}如果您遇到任何問題，請參考scripts/deploy-db.md文件${NC}"
