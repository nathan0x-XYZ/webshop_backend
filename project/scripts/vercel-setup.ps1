# Vercel數據庫設置和遷移腳本 (PowerShell版本)

# 顏色設置
$GREEN = [ConsoleColor]::Green
$BLUE = [ConsoleColor]::Cyan
$RED = [ConsoleColor]::Red

Write-Host "=== 時尚庫存管理系統 - Vercel部署助手 ===" -ForegroundColor $BLUE
Write-Host "此腳本將幫助您設置Vercel環境並遷移數據庫" -ForegroundColor $BLUE
Write-Host ""

# 檢查必要工具
Write-Host "檢查必要工具..." -ForegroundColor $BLUE
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "錯誤: npm未安裝" -ForegroundColor $RED
    Write-Host "請先安裝Node.js和npm: https://nodejs.org/"
    exit 1
}

if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
    Write-Host "錯誤: npx未安裝" -ForegroundColor $RED
    Write-Host "請更新您的npm版本或單獨安裝npx"
    exit 1
}

# 安裝Vercel CLI
Write-Host "安裝Vercel CLI..." -ForegroundColor $BLUE
npm install -g vercel

# 登錄Vercel
Write-Host "登錄Vercel..." -ForegroundColor $BLUE
Write-Host "如果您尚未登錄Vercel，請按照提示進行登錄"
vercel login

# 創建臨時環境文件
Write-Host "創建臨時環境文件..." -ForegroundColor $BLUE
Copy-Item .env .env.migration

# 提示用戶輸入雲端數據庫連接字符串
Write-Host "請輸入您的雲端數據庫連接字符串:" -ForegroundColor $BLUE
$DB_URL = Read-Host "DATABASE_URL="

# 更新臨時環境文件
Write-Host "更新臨時環境文件..." -ForegroundColor $BLUE
$envContent = Get-Content .env.migration
$envContent = $envContent -replace 'DATABASE_URL=.*', "DATABASE_URL=`"$DB_URL`""
Set-Content .env.migration $envContent

# 安裝dotenv-cli
Write-Host "安裝dotenv-cli..." -ForegroundColor $BLUE
npm install -g dotenv-cli

# 創建遷移
Write-Host "創建數據庫遷移..." -ForegroundColor $BLUE
npx dotenv -e .env.migration -- prisma migrate dev --name init

# 部署遷移
Write-Host "部署遷移到生產環境..." -ForegroundColor $BLUE
npx dotenv -e .env.migration -- prisma migrate deploy

# 詢問是否需要遷移數據
Write-Host "是否需要遷移現有數據? (y/n)" -ForegroundColor $BLUE
$MIGRATE_DATA = Read-Host

if ($MIGRATE_DATA -eq "y" -or $MIGRATE_DATA -eq "Y") {
    Write-Host "執行數據種子腳本..." -ForegroundColor $BLUE
    npx dotenv -e .env.migration -- prisma db seed
}

# 設置Vercel環境變數
Write-Host "設置Vercel環境變數..." -ForegroundColor $BLUE
Write-Host "請按照提示設置DATABASE_URL環境變數"
vercel env add DATABASE_URL

Write-Host "請輸入JWT密鑰用於身份驗證"
$JWT_SECRET = Read-Host "JWT_SECRET="
vercel env add JWT_SECRET

# 部署到Vercel
Write-Host "是否立即部署到Vercel? (y/n)" -ForegroundColor $BLUE
$DEPLOY_NOW = Read-Host

if ($DEPLOY_NOW -eq "y" -or $DEPLOY_NOW -eq "Y") {
    Write-Host "部署到Vercel..." -ForegroundColor $BLUE
    vercel --prod
    Write-Host "部署完成!" -ForegroundColor $GREEN
} else {
    Write-Host "您可以稍後使用以下命令部署:" -ForegroundColor $BLUE
    Write-Host "vercel --prod"
}

# 清理
Write-Host "清理臨時文件..." -ForegroundColor $BLUE
Remove-Item .env.migration

Write-Host "設置完成!" -ForegroundColor $GREEN
Write-Host "如果您遇到任何問題，請參考scripts/deploy-db.md文件" -ForegroundColor $BLUE
