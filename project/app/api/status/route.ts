// 這是一個簡單的 API 端點，用於檢查服務器狀態
// 不依賴於數據庫或身份驗證
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // 收集環境信息
  const environmentInfo = {
    nodeEnv: process.env.NODE_ENV || 'unknown',
    vercel: process.env.VERCEL === '1' ? 'true' : 'false',
    vercelEnv: process.env.VERCEL_ENV || 'unknown',
    region: process.env.VERCEL_REGION || 'unknown',
  };

  // 返回狀態信息
  return NextResponse.json({
    status: 'online',
    message: 'API 服務器正常運行 (App Router)',
    timestamp: new Date().toISOString(),
    environment: environmentInfo,
    request: {
      method: req.method,
      url: req.url,
      headers: {
        host: req.headers.get('host'),
        userAgent: req.headers.get('user-agent'),
      },
    },
  });
}

// 確保這個 API 路由是動態的
export const dynamic = 'force-dynamic';
