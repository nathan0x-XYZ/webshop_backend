import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// 初始化 Prisma 客戶端
const prisma = new PrismaClient();

export async function GET() {
  try {
    // 嘗試執行一個簡單的查詢來測試數據庫連接
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    
    return NextResponse.json({
      status: 'success',
      message: '數據庫連接成功',
      data: result,
      env: {
        databaseUrl: process.env.DATABASE_URL ? '已設置' : '未設置',
        prismaUrl: process.env.POSTGRES_PRISMA_URL ? '已設置' : '未設置',
        nodeEnv: process.env.NODE_ENV,
        isWebcontainer: process.env.IS_WEBCONTAINER
      }
    });
  } catch (error) {
    console.error('數據庫連接測試錯誤:', error);
    
    return NextResponse.json({
      status: 'error',
      message: '數據庫連接失敗',
      error: error instanceof Error ? error.message : String(error),
      env: {
        databaseUrl: process.env.DATABASE_URL ? '已設置' : '未設置',
        prismaUrl: process.env.POSTGRES_PRISMA_URL ? '已設置' : '未設置',
        nodeEnv: process.env.NODE_ENV,
        isWebcontainer: process.env.IS_WEBCONTAINER
      }
    }, { status: 500 });
  }
}
