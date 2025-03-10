// 這是一個極簡的測試頁面，不依賴於任何複雜的功能
export default function MinimalTest() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ color: '#0070f3' }}>極簡測試頁面 (App Router)</h1>
      <p>這是一個極簡的測試頁面，不依賴於任何複雜的功能。</p>
      <p>如果您能看到這個頁面，說明基本路由是正常工作的。</p>
      <p>生成時間: {new Date().toISOString()}</p>
      <div style={{ marginTop: '20px' }}>
        <a href="/" style={{ color: '#0070f3', textDecoration: 'underline' }}>返回首頁</a>
      </div>
    </div>
  );
}
