# 數據庫遷移到Vercel指南

## 前置準備

1. 安裝必要的工具：
   ```bash
   npm install -g vercel
   ```

2. 登錄Vercel（如果尚未登錄）：
   ```bash
   vercel login
   ```

## 步驟一：創建雲端數據庫

### 選項1：使用Vercel Postgres

1. 在Vercel儀表板中，選擇您的項目
2. 點擊"Storage"選項卡
3. 選擇"Connect Database"
4. 選擇"Postgres"
5. 按照指示完成設置
6. 獲取連接字符串

### 選項2：使用Supabase

1. 創建Supabase帳戶：https://supabase.com/
2. 創建新項目
3. 在項目設置中找到數據庫連接字符串
4. 格式化連接字符串為Prisma格式：
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

### 選項3：使用Railway

1. 創建Railway帳戶：https://railway.app/
2. 創建新項目並添加PostgreSQL數據庫
3. 在項目設置中找到連接字符串

## 步驟二：更新本地環境變數

1. 創建一個臨時.env文件用於遷移：
   ```bash
   cp .env .env.migration
   ```

2. 編輯.env.migration文件，更新DATABASE_URL為您的雲端數據庫連接字符串

## 步驟三：部署數據庫Schema

### 使用Prisma Migrate（推薦）

1. 創建遷移文件：
   ```bash
   npx dotenv -e .env.migration -- prisma migrate dev --name init
   ```

2. 部署遷移到生產環境：
   ```bash
   npx dotenv -e .env.migration -- prisma migrate deploy
   ```

### 使用Prisma DB Push（更簡單但不推薦用於生產）

```bash
npx dotenv -e .env.migration -- prisma db push
```

## 步驟四：遷移現有數據（可選）

### 選項1：使用PostgreSQL工具

1. 導出本地數據：
   ```bash
   pg_dump -U username -h localhost -d fashion_inventory > backup.sql
   ```

2. 導入到雲端數據庫：
   ```bash
   psql -U username -h your-cloud-host -d your-cloud-db < backup.sql
   ```

### 選項2：使用Prisma Seed

1. 確保您的seed腳本已正確設置：
   ```bash
   npx dotenv -e .env.migration -- prisma db seed
   ```

## 步驟五：在Vercel設置環境變數

1. 使用Vercel CLI設置環境變數：
   ```bash
   vercel env add DATABASE_URL
   # 輸入您的雲端數據庫連接字符串
   
   vercel env add JWT_SECRET
   # 輸入安全的JWT密鑰
   ```

2. 或者在Vercel儀表板中手動設置：
   - 進入您的項目
   - 點擊"Settings" > "Environment Variables"
   - 添加`DATABASE_URL`和`JWT_SECRET`

## 步驟六：部署應用到Vercel

```bash
vercel --prod
```

## 故障排除

### 問題：遷移失敗

1. 檢查連接字符串是否正確
2. 確保雲端數據庫可以從您的IP地址訪問
3. 檢查數據庫用戶是否有足夠的權限

### 問題：部署後應用無法連接到數據庫

1. 檢查Vercel環境變數是否正確設置
2. 確保雲端數據庫允許來自Vercel的連接
3. 查看Vercel部署日誌中的錯誤信息

### 問題：數據遷移後丟失或不完整

1. 檢查遷移日誌
2. 考慮使用更可靠的數據遷移工具
3. 如果可能，手動驗證關鍵數據
