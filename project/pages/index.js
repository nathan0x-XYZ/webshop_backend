import { useState, useEffect } from 'react';

export default function Home() {
  const [apiStatus, setApiStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 檢查 API 狀態
  const checkApiStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      setApiStatus(data);
    } catch (err) {
      console.error('API 檢查失敗:', err);
      setError('無法連接到 API: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ color: '#0070f3' }}>Fashion Inventory System</h1>
      <p>歡迎使用時尚庫存系統。這是一個測試頁面。</p>
      <p>狀態: 在線</p>
      
      <div style={{ marginTop: '20px' }}>
        <a 
          href="/test.html" 
          style={{ 
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            marginRight: '10px'
          }}
        >
          靜態測試頁面
        </a>
        
        <button 
          onClick={checkApiStatus}
          style={{ 
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? '檢查中...' : '檢查 API 狀態'}
        </button>
      </div>
      
      {error && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          borderRadius: '5px' 
        }}>
          <p>{error}</p>
        </div>
      )}
      
      {apiStatus && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f5f5f5',
          borderRadius: '5px',
          textAlign: 'left' 
        }}>
          <h3>API 狀態信息</h3>
          <pre style={{ 
            backgroundColor: '#e0e0e0', 
            padding: '10px', 
            borderRadius: '5px',
            overflow: 'auto' 
          }}>
            {JSON.stringify(apiStatus, null, 2)}
          </pre>
        </div>
      )}
      
      <div style={{ marginTop: '30px', fontSize: '0.8rem', color: '#666' }}>
        <p>頁面生成時間: {new Date().toISOString()}</p>
      </div>
    </div>
  );
}
