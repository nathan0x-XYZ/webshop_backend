import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fashion Inventory System</h1>
      
      <div className="flex flex-col space-y-2 mb-6">
        <h2 className="text-xl font-semibold">測試頁面</h2>
        <Link href="/test-simple" className="text-blue-500 hover:underline">
          簡單測試頁面
        </Link>
        <Link href="/db-test" className="text-blue-500 hover:underline">
          數據庫連接測試頁面
        </Link>
      </div>
      
      <div className="flex flex-col space-y-2">
        <h2 className="text-xl font-semibold">測試 API</h2>
        <Link href="/api/test-simple" className="text-blue-500 hover:underline">
          簡單測試 API
        </Link>
        <Link href="/api/db-test" className="text-blue-500 hover:underline">
          數據庫連接測試 API
        </Link>
      </div>
      
      <div className="mt-8 text-sm text-gray-500">
        <p>頁面生成時間: {new Date().toISOString()}</p>
      </div>
    </div>
  );
}