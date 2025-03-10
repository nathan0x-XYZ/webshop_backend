// 這是一個簡單的 API 端點，用於檢查服務器狀態
// 不依賴於數據庫或身份驗證

export default function handler(req, res) {
  // 收集環境信息
  const environmentInfo = {
    nodeEnv: process.env.NODE_ENV || 'unknown',
    vercel: process.env.VERCEL === '1' ? 'true' : 'false',
    vercelEnv: process.env.VERCEL_ENV || 'unknown',
    region: process.env.VERCEL_REGION || 'unknown',
  };

  // 返回狀態信息
  res.status(200).json({
    status: 'online',
    message: 'API 服務器正常運行',
    timestamp: new Date().toISOString(),
    environment: environmentInfo,
    request: {
      method: req.method,
      url: req.url,
      headers: {
        host: req.headers.host,
        userAgent: req.headers['user-agent'],
      },
    },
  });
}
