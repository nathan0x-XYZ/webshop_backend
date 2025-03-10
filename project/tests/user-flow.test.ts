import { test, expect } from '@playwright/test';

// 模擬使用者流程的測試套件
test.describe('Fashion Inventory System User Flow Tests', () => {
  
  // 在每個測試前先登入系統
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    // 確認已成功登入
    await expect(page).toHaveURL('/dashboard');
  });

  // 1. 產品管理流程測試
  test('Product Management Flow', async ({ page }) => {
    // 1.1 查看產品列表
    await page.goto('/products');
    await expect(page.locator('h1')).toContainText('Products');
    await expect(page.locator('table')).toBeVisible();
    
    // 1.2 新增產品
    await page.click('a:has-text("Add Product")');
    await expect(page).toHaveURL('/products/new');
    
    const productName = `Test Product ${Date.now()}`;
    const sku = `SKU-${Date.now().toString().slice(-6)}`;
    
    await page.fill('input[name="name"]', productName);
    await page.fill('input[name="sku"]', sku);
    await page.fill('input[name="description"]', 'Test product description');
    await page.fill('input[name="costPrice"]', '10.99');
    await page.fill('input[name="sellingPrice"]', '19.99');
    await page.selectOption('select[name="categoryId"]', { index: 1 });
    await page.click('button[type="submit"]');
    
    // 確認產品已成功創建
    await expect(page).toHaveURL('/products');
    await expect(page.locator(`text=${productName}`)).toBeVisible();
    
    // 1.3 查看產品詳情
    await page.click(`tr:has-text("${productName}") a:has-text("View")`);
    await expect(page.locator('h1')).toContainText(productName);
    
    // 1.4 編輯產品
    await page.click('button:has-text("Edit")');
    const updatedName = `${productName} (Updated)`;
    await page.fill('input[name="name"]', updatedName);
    await page.click('button[type="submit"]');
    
    // 確認產品已成功更新
    await expect(page.locator('h1')).toContainText(updatedName);
    
    // 1.5 嘗試刪除產品（應該成功，因為沒有關聯交易）
    await page.goto('/products');
    await page.click(`tr:has-text("${updatedName}") button:has-text("Delete")`);
    await page.click('button:has-text("Confirm")');
    
    // 確認產品已成功刪除
    await expect(page.locator(`text=${updatedName}`)).not.toBeVisible();
    
    // 1.6 創建一個有庫存的產品
    await page.click('a:has-text("Add Product")');
    const productWithStock = `Product With Stock ${Date.now()}`;
    const skuWithStock = `SKU-S-${Date.now().toString().slice(-6)}`;
    
    await page.fill('input[name="name"]', productWithStock);
    await page.fill('input[name="sku"]', skuWithStock);
    await page.fill('input[name="description"]', 'Product with stock');
    await page.fill('input[name="costPrice"]', '15.99');
    await page.fill('input[name="sellingPrice"]', '29.99');
    await page.selectOption('select[name="categoryId"]', { index: 1 });
    await page.click('button[type="submit"]');
    
    // 添加庫存
    await page.goto('/inventory');
    await page.click('button:has-text("Adjust Stock")');
    await page.selectOption('select[name="productId"]', { label: productWithStock });
    await page.selectOption('select[name="warehouseId"]', { index: 0 });
    await page.fill('input[name="quantity"]', '10');
    await page.click('button[type="submit"]');
    
    // 1.7 嘗試刪除有庫存的產品（應該失敗）
    await page.goto('/products');
    await page.click(`tr:has-text("${productWithStock}") button:has-text("Delete")`);
    await page.click('button:has-text("Confirm")');
    
    // 確認顯示錯誤訊息
    await expect(page.locator('text=Cannot delete a product with inventory')).toBeVisible();
    
    // 1.8 創建一個有關聯交易的產品（通過採購）
    await page.click('a:has-text("Add Product")');
    const productWithTransaction = `Product With Transaction ${Date.now()}`;
    const skuWithTransaction = `SKU-T-${Date.now().toString().slice(-6)}`;
    
    await page.fill('input[name="name"]', productWithTransaction);
    await page.fill('input[name="sku"]', skuWithTransaction);
    await page.fill('input[name="description"]', 'Product with transaction');
    await page.fill('input[name="costPrice"]', '25.99');
    await page.fill('input[name="sellingPrice"]', '39.99');
    await page.selectOption('select[name="categoryId"]', { index: 1 });
    await page.click('button[type="submit"]');
    
    // 創建採購訂單
    await page.goto('/purchases/new');
    await page.selectOption('select[name="supplierId"]', { index: 0 });
    await page.selectOption('select[name="warehouseId"]', { index: 0 });
    
    // 添加產品到採購訂單
    await page.selectOption('select[name="productId"]', { label: productWithTransaction });
    await page.fill('input[name="quantity"]', '5');
    await page.click('button:has-text("Add")');
    
    // 提交採購訂單
    await page.click('button[type="submit"]');
    
    // 1.9 嘗試刪除有關聯交易的產品（應該失敗）
    await page.goto('/products');
    await page.click(`tr:has-text("${productWithTransaction}") button:has-text("Delete")`);
    await page.click('button:has-text("Confirm")');
    
    // 確認顯示錯誤訊息
    await expect(page.locator('text=Cannot delete a product with related transactions')).toBeVisible();
  });

  // 2. 採購管理流程測試
  test('Purchase Management Flow', async ({ page }) => {
    // 2.1 查看採購訂單列表
    await page.goto('/purchases');
    await expect(page.locator('h1')).toContainText('Purchases');
    
    // 2.2 創建新採購訂單
    await page.click('a:has-text("New Purchase")');
    await expect(page).toHaveURL('/purchases/new');
    
    // 選擇供應商和倉庫
    await page.selectOption('select[name="supplierId"]', { index: 0 });
    await page.selectOption('select[name="warehouseId"]', { index: 0 });
    
    // 2.3 添加產品到採購訂單
    await page.selectOption('select[name="productId"]', { index: 0 });
    await page.fill('input[name="quantity"]', '10');
    await page.fill('input[name="unitPrice"]', '9.99');
    await page.click('button:has-text("Add")');
    
    // 添加另一個產品
    await page.selectOption('select[name="productId"]', { index: 1 });
    await page.fill('input[name="quantity"]', '5');
    await page.fill('input[name="unitPrice"]', '14.99');
    await page.click('button:has-text("Add")');
    
    // 確認產品已添加
    await expect(page.locator('table tr')).toHaveCount(3); // 表頭 + 2個產品
    
    // 2.4 提交採購訂單
    await page.click('button[type="submit"]');
    
    // 確認採購訂單已創建
    await expect(page).toHaveURL('/purchases');
    
    // 2.5 查看採購訂單詳情
    await page.click('tr:nth-child(1) a:has-text("View")');
    await expect(page.locator('h1')).toContainText('Purchase Order');
    
    // 2.6 接收採購訂單
    await page.click('button:has-text("Receive")');
    await page.click('button:has-text("Confirm")');
    
    // 確認訂單狀態已更新
    await expect(page.locator('text=RECEIVED')).toBeVisible();
    
    // 2.7 檢查庫存是否已增加
    await page.goto('/inventory');
    // 這裡需要檢查特定產品的庫存是否增加，但由於我們不知道具體產品名稱，所以只能檢查頁面是否載入
    await expect(page.locator('h1')).toContainText('Inventory');
  });

  // 3. 銷售管理流程測試
  test('Sales Management Flow', async ({ page }) => {
    // 3.1 查看銷售訂單列表
    await page.goto('/sales');
    await expect(page.locator('h1')).toContainText('Sales');
    
    // 3.2 創建新銷售訂單
    await page.click('a:has-text("New Sale")');
    await expect(page).toHaveURL('/sales/new');
    
    // 3.3 選擇倉庫
    await page.selectOption('select[name="warehouseId"]', { index: 0 });
    
    // 3.4 添加產品到銷售訂單
    await page.selectOption('select[name="productId"]', { index: 0 });
    await page.fill('input[name="quantity"]', '2');
    await page.click('button:has-text("Add")');
    
    // 3.5 添加另一個產品
    await page.selectOption('select[name="productId"]', { index: 1 });
    await page.fill('input[name="quantity"]', '1');
    await page.click('button:has-text("Add")');
    
    // 確認產品已添加
    await expect(page.locator('table tr')).toHaveCount(3); // 表頭 + 2個產品
    
    // 3.6 輸入客戶信息
    await page.fill('input[name="customerName"]', 'John Doe');
    await page.fill('input[name="customerContact"]', '555-123-4567');
    
    // 3.7 提交銷售訂單
    await page.click('button[type="submit"]');
    
    // 確認銷售訂單已創建
    await expect(page).toHaveURL('/sales');
    
    // 3.8 查看銷售訂單詳情
    await page.click('tr:nth-child(1) a:has-text("View")');
    await expect(page.locator('h1')).toContainText('Sales Order');
    
    // 3.9 檢查客戶信息
    await expect(page.locator('text=John Doe')).toBeVisible();
    
    // 3.10 嘗試創建庫存不足的銷售訂單
    await page.goto('/sales/new');
    await page.selectOption('select[name="warehouseId"]', { index: 0 });
    
    // 選擇產品並輸入超過庫存的數量
    await page.selectOption('select[name="productId"]', { index: 0 });
    await page.fill('input[name="quantity"]', '1000'); // 假設庫存不足1000件
    await page.click('button:has-text("Add")');
    
    // 確認顯示庫存不足警告
    await expect(page.locator('text=Insufficient stock')).toBeVisible();
  });

  // 4. 庫存調撥流程測試
  test('Inventory Transfer Flow', async ({ page }) => {
    // 4.1 查看調撥列表
    await page.goto('/transfers');
    await expect(page.locator('h1')).toContainText('Transfers');
    
    // 4.2 創建新調撥單
    await page.click('a:has-text("New Transfer")');
    await expect(page).toHaveURL('/transfers/new');
    
    // 4.3 選擇來源和目標倉庫
    await page.selectOption('select[name="sourceWarehouseId"]', { index: 0 });
    await page.selectOption('select[name="destinationWarehouseId"]', { index: 1 });
    
    // 4.4 添加產品到調撥單
    await page.selectOption('select[name="productId"]', { index: 0 });
    await page.fill('input[name="quantity"]', '2');
    await page.click('button:has-text("Add")');
    
    // 確認產品已添加
    await expect(page.locator('table tr')).toHaveCount(2); // 表頭 + 1個產品
    
    // 4.5 提交調撥單
    await page.click('button[type="submit"]');
    
    // 確認調撥單已創建
    await expect(page).toHaveURL('/transfers');
    
    // 4.6 查看調撥單詳情
    await page.click('tr:nth-child(1) a:has-text("View")');
    await expect(page.locator('h1')).toContainText('Transfer');
    
    // 4.7 嘗試創建庫存不足的調撥單
    await page.goto('/transfers/new');
    await page.selectOption('select[name="sourceWarehouseId"]', { index: 0 });
    await page.selectOption('select[name="destinationWarehouseId"]', { index: 1 });
    
    // 選擇產品並輸入超過庫存的數量
    await page.selectOption('select[name="productId"]', { index: 0 });
    await page.fill('input[name="quantity"]', '1000'); // 假設庫存不足1000件
    await page.click('button:has-text("Add")');
    
    // 確認顯示庫存不足警告
    await expect(page.locator('text=Insufficient stock')).toBeVisible();
  });

  // 5. 庫存盤點流程測試
  test('Inventory Audit Flow', async ({ page }) => {
    // 5.1 查看盤點列表
    await page.goto('/inventory-audit');
    await expect(page.locator('h1')).toContainText('Inventory Audit');
    
    // 5.2 創建新盤點單
    await page.click('a:has-text("New Audit")');
    await expect(page).toHaveURL('/inventory-audit/new');
    
    // 5.3 選擇倉庫
    await page.selectOption('select[name="warehouseId"]', { index: 0 });
    
    // 5.4 添加產品到盤點單
    await page.click('button:has-text("Add All Products")');
    
    // 確認產品已添加
    await expect(page.locator('table tr')).toHaveCountGreaterThan(1);
    
    // 5.5 輸入實際庫存數量
    await page.locator('table tr:nth-child(2) input[name="actualQuantity"]').fill('8');
    
    // 5.6 提交盤點單
    await page.click('button[type="submit"]');
    
    // 確認盤點單已創建
    await expect(page).toHaveURL('/inventory-audit');
    
    // 5.7 查看盤點單詳情
    await page.click('tr:nth-child(1) a:has-text("View")');
    await expect(page.locator('h1')).toContainText('Audit');
  });

  // 6. 報表和分析流程測試
  test('Reports and Analytics Flow', async ({ page }) => {
    // 6.1 查看銷售報表
    await page.goto('/reports/sales');
    await expect(page.locator('h1')).toContainText('Sales Report');
    
    // 6.2 按日期範圍篩選報表
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 1);
    
    await page.fill('input[name="startDate"]', startDate.toISOString().split('T')[0]);
    await page.fill('input[name="endDate"]', today.toISOString().split('T')[0]);
    await page.click('button:has-text("Apply")');
    
    // 確認報表已更新
    await expect(page.locator('canvas')).toBeVisible();
    
    // 6.3 查看庫存報表
    await page.goto('/reports/inventory');
    await expect(page.locator('h1')).toContainText('Inventory Report');
    
    // 6.4 查看採購報表
    await page.goto('/reports/purchases');
    await expect(page.locator('h1')).toContainText('Purchase Report');
  });

  // 7. 用戶管理流程測試（僅限ROOT或ADMIN角色）
  test('User Management Flow', async ({ page }) => {
    // 7.1 查看用戶列表
    await page.goto('/users');
    await expect(page.locator('h1')).toContainText('Users');
    
    // 7.2 創建新用戶
    await page.click('a:has-text("Add User")');
    await expect(page).toHaveURL('/users/new');
    
    const userName = `Test User ${Date.now()}`;
    const userEmail = `testuser${Date.now()}@example.com`;
    
    await page.fill('input[name="name"]', userName);
    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="password"]', 'Password123!');
    await page.selectOption('select[name="role"]', 'STAFF');
    await page.click('button[type="submit"]');
    
    // 確認用戶已創建
    await expect(page).toHaveURL('/users');
    await expect(page.locator(`text=${userName}`)).toBeVisible();
    
    // 7.3 編輯用戶
    await page.click(`tr:has-text("${userName}") a:has-text("Edit")`);
    const updatedName = `${userName} (Updated)`;
    await page.fill('input[name="name"]', updatedName);
    await page.click('button[type="submit"]');
    
    // 確認用戶已更新
    await expect(page).toHaveURL('/users');
    await expect(page.locator(`text=${updatedName}`)).toBeVisible();
    
    // 7.4 禁用用戶
    await page.click(`tr:has-text("${updatedName}") button:has-text("Disable")`);
    await page.click('button:has-text("Confirm")');
    
    // 確認用戶已禁用
    await expect(page.locator(`tr:has-text("${updatedName}") text=Disabled`)).toBeVisible();
  });
});
