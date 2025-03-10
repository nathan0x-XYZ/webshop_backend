import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ color: '#0070f3' }}>Fashion Inventory System</h1>
      <p>Welcome to the Fashion Inventory System</p>
      
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        <h2>測試頁面</h2>
        <a href="/minimal" style={{ color: '#0070f3', textDecoration: 'underline' }}>
          極簡測試頁面
        </a>
        <a href="/test-simple" style={{ color: '#0070f3', textDecoration: 'underline' }}>
          簡單測試頁面
        </a>
        <a href="/db-test" style={{ color: '#0070f3', textDecoration: 'underline' }}>
          數據庫連接測試頁面
        </a>
      </div>
      
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        <h2>測試 API</h2>
        <a href="/api/test-simple" style={{ color: '#0070f3', textDecoration: 'underline' }}>
          簡單測試 API
        </a>
        <a href="/api/db-test" style={{ color: '#0070f3', textDecoration: 'underline' }}>
          數據庫連接測試 API
        </a>
      </div>
      
      <div style={{ marginTop: '30px', fontSize: '0.8rem', color: '#666' }}>
        <p>頁面生成時間: {new Date().toISOString()}</p>
      </div>
    </div>
  );
}