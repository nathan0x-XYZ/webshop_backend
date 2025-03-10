// Vercel 部署腳本
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 輸出調試信息
console.log('Starting Vercel deployment script...');
console.log(`Node version: ${process.version}`);
console.log(`Working directory: ${process.cwd()}`);
console.log(`Environment: ${process.env.VERCEL_ENV || 'unknown'}`);

// 設置環境變量
process.env.IS_WEBCONTAINER = 'false';
process.env.NODE_ENV = 'production';

try {
  // 生成 Prisma 客戶端
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // 嘗試執行 Prisma 部署腳本，但不讓它阻止構建
  console.log('Running Prisma deploy script...');
  try {
    // 檢查文件是否存在
    const deployScriptPath = path.join(process.cwd(), 'prisma', 'vercel-deploy.ts');
    const deployScriptJsPath = path.join(process.cwd(), 'prisma', 'vercel-deploy.js');
    
    if (fs.existsSync(deployScriptPath)) {
      console.log('Found TypeScript deploy script, executing...');
      execSync('ts-node --compiler-options {"module":"CommonJS"} prisma/vercel-deploy.ts', { stdio: 'inherit' });
    } else if (fs.existsSync(deployScriptJsPath)) {
      console.log('Found JavaScript deploy script, executing...');
      require('./prisma/vercel-deploy.js');
    } else {
      console.log('No deploy script found, skipping database initialization');
    }
  } catch (e) {
    console.error('Prisma deploy script failed, but continuing build:', e.message);
  }

  console.log('Vercel deployment script completed successfully.');
} catch (error) {
  console.error('Error in Vercel deployment script:', error.message);
  // 不退出進程，讓構建繼續
}
