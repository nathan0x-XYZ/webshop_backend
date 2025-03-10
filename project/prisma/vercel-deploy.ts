import { PrismaClient } from '@prisma/client';

// 這個腳本專門用於 Vercel 部署
// 它會確保 Prisma 客戶端能夠正確連接到 Neon 數據庫

// 創建 Prisma 客戶端實例
const prisma = new PrismaClient();

async function main() {
  try {
    // 嘗試連接到數據庫
    const connection = await prisma.$connect();
    console.log('Successfully connected to the database');
    
    // 執行一個簡單的查詢以確認連接
    const result = await prisma.$queryRaw`SELECT 1+1 as result`;
    console.log('Database query successful:', result);
    
    return { success: true };
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return { success: false, error };
  } finally {
    await prisma.$disconnect();
  }
}

// 如果這個文件被直接執行（而不是被導入）
if (require.main === module) {
  main()
    .then((result) => {
      console.log('Deployment check completed:', result);
      if (!result.success) {
        process.exit(1);
      }
    })
    .catch((e) => {
      console.error('Deployment check failed:', e);
      process.exit(1);
    });
}

export default main;
