'use client';

import { useState, useEffect } from 'react';

export default function DbTestPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/db-test');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : '發生未知錯誤');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">數據庫連接測試</h1>
      
      {loading && <p>加載中...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p><strong>錯誤:</strong> {error}</p>
        </div>
      )}
      
      {data && (
        <div className="bg-white shadow-md rounded p-4">
          <h2 className="text-xl font-semibold mb-2">測試結果</h2>
          <p><strong>狀態:</strong> {data.status}</p>
          <p><strong>訊息:</strong> {data.message}</p>
          
          {data.data && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">數據:</h3>
              <pre className="bg-gray-100 p-2 rounded mt-2">
                {JSON.stringify(data.data, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold">環境變量:</h3>
            <ul className="list-disc list-inside mt-2">
              <li>DATABASE_URL: {data.env.databaseUrl}</li>
              <li>POSTGRES_PRISMA_URL: {data.env.prismaUrl}</li>
              <li>NODE_ENV: {data.env.nodeEnv}</li>
              <li>IS_WEBCONTAINER: {data.env.isWebcontainer}</li>
            </ul>
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <a href="/" className="text-blue-500 hover:underline">返回首頁</a>
      </div>
    </div>
  );
}
