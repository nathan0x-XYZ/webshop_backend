// 這是一個專用的 Vercel 啟動文件
// 它會確保 Vercel 能夠正確處理我們的 Next.js 應用程序

// 導入 Next.js 處理程序
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// 確定環境
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// 設置端口
const port = process.env.PORT || 3000;

// 準備 Next.js 應用程序
app.prepare().then(() => {
  // 創建 HTTP 服務器
  createServer((req, res) => {
    // 解析請求 URL
    const parsedUrl = parse(req.url, true);
    
    // 讓 Next.js 處理請求
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

// 導出處理程序供 Vercel 使用
module.exports = (req, res) => {
  // 解析請求 URL
  const parsedUrl = parse(req.url, true);
  
  // 讓 Next.js 處理請求
  return handle(req, res, parsedUrl);
};
