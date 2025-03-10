import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fashion Inventory System</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/dashboard" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">儀表板</h2>
          <p className="text-gray-600">查看庫存概況和重要指標</p>
        </Link>
        
        <Link href="/products" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">產品管理</h2>
          <p className="text-gray-600">管理產品目錄和庫存水平</p>
        </Link>
        
        <Link href="/categories" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">類別管理</h2>
          <p className="text-gray-600">管理產品類別和分類</p>
        </Link>
        
        <Link href="/orders" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">訂單管理</h2>
          <p className="text-gray-600">處理訂單和跟踪訂單狀態</p>
        </Link>
        
        <Link href="/suppliers" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">供應商管理</h2>
          <p className="text-gray-600">管理供應商和採購訂單</p>
        </Link>
        
        <Link href="/reports" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">報表和分析</h2>
          <p className="text-gray-600">生成庫存報表和銷售分析</p>
        </Link>
      </div>
      
      <div className="mt-8 text-sm text-gray-500">
        <p>頁面生成時間: {new Date().toISOString()}</p>
      </div>
    </div>
  );
}