# API 路由問題修復文檔

## 問題描述

我們的 Next.js 應用在 Vercel 部署後出現了以下問題：
- 登入功能正常，但進入產品、倉庫、調撥單等頁面時顯示錯誤
- API 路由返回 404 錯誤
- 控制台顯示 `TypeError: Cannot read properties of undefined (reading 'product')` 錯誤

## 解決方案

我們通過以下步驟成功解決了問題：

### 1. Vercel 部署配置問題

更新了 `vercel.json` 文件，添加了更詳細的配置：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_VERCEL_URL": "${VERCEL_URL}"
  }
}
```

特別重要的是添加了 API 路由配置，確保所有以 `/api/` 開頭的請求都會被正確路由到相應的 API 處理程序。

### 2. Prisma 模型引用問題

修改了所有 API 路由文件，解決了兩個主要問題：

1. **錯誤的導入**：將 `import { db } from "@/lib/db"` 改為 `import { prisma } from "@/lib/db"`，因為在 `lib/db.ts` 中導出的是 `prisma` 對象而不是 `db` 對象。

2. **錯誤的模型名稱**：更正了模型名稱，確保與 Prisma schema 中定義的一致：
   - `transfer` → `transferOrder`
   - `purchase` → `purchaseOrder`

3. **更新 include 選項**：確保包含必要的關聯數據，例如：

```typescript
const transfers = await prisma.transferOrder.findMany({
  include: {
    sourceWarehouse: true,
    destinationWarehouse: true,
    items: {
      include: {
        product: true,
      },
    },
  },
  orderBy: {
    updatedAt: 'desc',
  },
});
```

## 受影響的文件

以下 API 路由文件被修改：
- `/app/api/products/route.ts`
- `/app/api/warehouses/route.ts`
- `/app/api/transfers/route.ts`
- `/app/api/suppliers/route.ts`
- `/app/api/purchases/route.ts`
- `/app/api/inventory-audits/route.ts`

## 經驗教訓

1. 確保 API 路由中使用的模型名稱與 Prisma schema 中定義的完全一致
2. 正確導入和使用 Prisma 客戶端（`prisma` 而不是 `db`）
3. Vercel 部署需要特別注意配置，尤其是 API 路由的處理
4. 在部署前，先在本地環境測試 API 路由功能

## 版本標記

這個修復已經標記為 `v1.0.0`，並且創建了一個備份分支 `stable-v1.0.0`，以便將來參考。

## 下一步

- 進行單元測試，確保所有 API 路由功能正常
- 添加更多的錯誤處理和日誌記錄
- 優化 API 路由的性能
