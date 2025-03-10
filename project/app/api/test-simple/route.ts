// 這是一個極簡的 API 端點，僅用於測試 Vercel 部署
// 不依賴於任何數據庫、身份驗證或複雜功能
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    message: '這是一個極簡的測試 API 端點',
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV || 'unknown',
      vercel: process.env.VERCEL === '1' ? 'true' : 'false',
    }
  });
}

// 確保這個 API 路由是動態的
export const dynamic = 'force-dynamic';
