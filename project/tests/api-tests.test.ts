import { test, expect } from '@playwright/test';

// API測試套件
test.describe('Fashion Inventory System API Tests', () => {
  
  // 測試變量
  const baseUrl = 'http://localhost:3000/api';
  let authToken: string;
  let testProductId: string;
  let testWarehouseId: string;
  
  // 在所有測試前獲取認證令牌
  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${baseUrl}/auth/login`, {
      data: {
        email: 'admin@example.com',
        password: 'password123',
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    authToken = data.token;
  });
  
  // 1. 產品API測試
  test('Product API Tests', async ({ request }) => {
    // 1.1 獲取產品列表
    const getProductsResponse = await request.get(`${baseUrl}/products`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(getProductsResponse.ok()).toBeTruthy();
    const products = await getProductsResponse.json();
    expect(Array.isArray(products)).toBeTruthy();
    
    // 1.2 創建產品
    const createProductResponse = await request.post(`${baseUrl}/products`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        name: `API Test Product ${Date.now()}`,
        sku: `API-${Date.now().toString().slice(-6)}`,
        description: 'Created via API test',
        costPrice: 12.99,
        sellingPrice: 24.99,
        categoryId: products[0]?.categoryId || '1',
      }
    });
    
    expect(createProductResponse.ok()).toBeTruthy();
    const createdProduct = await createProductResponse.json();
    testProductId = createdProduct.id;
    
    // 1.3 獲取單個產品
    const getProductResponse = await request.get(`${baseUrl}/products/${testProductId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(getProductResponse.ok()).toBeTruthy();
    const product = await getProductResponse.json();
    expect(product.id).toBe(testProductId);
    
    // 1.4 更新產品
    const updateProductResponse = await request.put(`${baseUrl}/products/${testProductId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        name: `${product.name} (Updated)`,
        description: 'Updated via API test',
      }
    });
    
    expect(updateProductResponse.ok()).toBeTruthy();
    
    // 1.5 檢查產品關聯
    const checkRelationsResponse = await request.get(`${baseUrl}/products/${testProductId}/check-relations`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(checkRelationsResponse.ok()).toBeTruthy();
    const relationData = await checkRelationsResponse.json();
    expect(relationData).toHaveProperty('hasRelations');
    expect(relationData.hasRelations).toBe(false);
    
    // 1.6 刪除產品
    const deleteProductResponse = await request.delete(`${baseUrl}/products/${testProductId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(deleteProductResponse.ok()).toBeTruthy();
  });
  
  // 2. 庫存API測試
  test('Inventory API Tests', async ({ request }) => {
    // 2.1 獲取倉庫列表
    const getWarehousesResponse = await request.get(`${baseUrl}/warehouses`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(getWarehousesResponse.ok()).toBeTruthy();
    const warehouses = await getWarehousesResponse.json();
    expect(Array.isArray(warehouses)).toBeTruthy();
    testWarehouseId = warehouses[0]?.id;
    
    // 2.2 創建測試產品
    const createProductResponse = await request.post(`${baseUrl}/products`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        name: `Inventory Test Product ${Date.now()}`,
        sku: `INV-${Date.now().toString().slice(-6)}`,
        description: 'Created for inventory API test',
        costPrice: 15.99,
        sellingPrice: 29.99,
        categoryId: '1',
      }
    });
    
    expect(createProductResponse.ok()).toBeTruthy();
    const createdProduct = await createProductResponse.json();
    testProductId = createdProduct.id;
    
    // 2.3 檢查庫存（應該為0）
    const checkInventoryResponse = await request.get(`${baseUrl}/inventory?productId=${testProductId}&warehouseId=${testWarehouseId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(checkInventoryResponse.ok()).toBeTruthy();
    const inventoryData = await checkInventoryResponse.json();
    expect(inventoryData.quantity).toBe(0);
    
    // 2.4 調整庫存
    const adjustInventoryResponse = await request.post(`${baseUrl}/inventory/adjust`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        productId: testProductId,
        warehouseId: testWarehouseId,
        quantity: 10,
        notes: 'Adjusted via API test',
      }
    });
    
    expect(adjustInventoryResponse.ok()).toBeTruthy();
    
    // 2.5 再次檢查庫存（應該為10）
    const checkInventoryAgainResponse = await request.get(`${baseUrl}/inventory?productId=${testProductId}&warehouseId=${testWarehouseId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(checkInventoryAgainResponse.ok()).toBeTruthy();
    const updatedInventoryData = await checkInventoryAgainResponse.json();
    expect(updatedInventoryData.quantity).toBe(10);
  });
  
  // 3. 銷售API測試
  test('Sales API Tests', async ({ request }) => {
    // 3.1 獲取銷售訂單列表
    const getSalesResponse = await request.get(`${baseUrl}/sales`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(getSalesResponse.ok()).toBeTruthy();
    const sales = await getSalesResponse.json();
    expect(Array.isArray(sales)).toBeTruthy();
    
    // 3.2 創建銷售訂單
    const createSaleResponse = await request.post(`${baseUrl}/sales`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        warehouseId: testWarehouseId,
        customerName: 'API Test Customer',
        customerContact: '555-API-TEST',
        notes: 'Created via API test',
        items: [
          {
            productId: testProductId,
            quantity: 2,
            unitPrice: 29.99,
          }
        ],
        totalAmount: 59.98,
      }
    });
    
    expect(createSaleResponse.ok()).toBeTruthy();
    const createdSale = await createSaleResponse.json();
    
    // 3.3 檢查庫存是否已減少
    const checkInventoryResponse = await request.get(`${baseUrl}/inventory?productId=${testProductId}&warehouseId=${testWarehouseId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(checkInventoryResponse.ok()).toBeTruthy();
    const inventoryData = await checkInventoryResponse.json();
    expect(inventoryData.quantity).toBe(8); // 10 - 2 = 8
    
    // 3.4 嘗試創建庫存不足的銷售訂單
    const createInsufficientSaleResponse = await request.post(`${baseUrl}/sales`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        warehouseId: testWarehouseId,
        customerName: 'API Test Customer',
        customerContact: '555-API-TEST',
        notes: 'Should fail due to insufficient stock',
        items: [
          {
            productId: testProductId,
            quantity: 20, // 超過庫存
            unitPrice: 29.99,
          }
        ],
        totalAmount: 599.80,
      }
    });
    
    expect(createInsufficientSaleResponse.ok()).toBeFalsy();
    const errorData = await createInsufficientSaleResponse.json();
    expect(errorData.message).toContain('Insufficient stock');
  });
  
  // 4. 清理測試數據
  test.afterAll(async ({ request }) => {
    // 嘗試刪除測試產品（可能會失敗，因為有關聯交易）
    await request.delete(`${baseUrl}/products/${testProductId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  });
});
