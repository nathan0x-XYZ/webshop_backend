@echo off
echo 正在執行構建過程，跳過類型檢查...
set TYPESCRIPT_SKIP_CHECKING=true
npx prisma generate
npx prisma migrate deploy
npx next build --no-lint
echo 構建完成！
