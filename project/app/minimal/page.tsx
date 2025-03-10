// 這是一個極簡的測試頁面，不依賴於任何複雜的功能
export default function MinimalTest() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ color: '#0070f3' }}>極簡測試頁面 (App Router)</h1>
      <p>這是一個極簡的測試頁面，不依賴於任何複雜的功能。</p>
      <p>如果您能看到這個頁面，說明基本路由是正常工作的。</p>
      <p>請嘗試訪問: <code>/minimal</code></p>
      <div style={{ marginTop: '30px', fontSize: '0.8rem', color: '#666' }}>
        <p>頁面生成時間: {new Date().toISOString()}</p>
      </div>
    </div>
  );
}
