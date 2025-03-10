import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// 這個腳本專門用於 Vercel 部署
// 它會確保 Prisma 客戶端能夠正確連接到 Neon 數據庫，並初始化必要的數據

// 創建 Prisma 客戶端實例
const prisma = new PrismaClient();

async function main() {
  try {
    // 嘗試連接到數據庫
    await prisma.$connect();
    console.log('Successfully connected to the database');
    
    // 執行一個簡單的查詢以確認連接
    const result = await prisma.$queryRaw`SELECT 1+1 as result`;
    console.log('Database query successful:', result);
    
    // 檢查是否已有用戶
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in the database`);
    
    // 如果沒有用戶，創建初始管理員用戶
    if (userCount === 0) {
      console.log('No users found, creating initial admin user');
      
      // 創建管理員用戶
      const adminUser = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@example.com',
          hashedPassword: await bcrypt.hash('admin123', 10),
          role: UserRole.ADMIN,
        },
      });
      console.log('Created admin user:', adminUser.email);
      
      // 創建測試用戶
      const testUser = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          hashedPassword: await bcrypt.hash('test123', 10),
          role: UserRole.STAFF,
        },
      });
      console.log('Created test user:', testUser.email);
      
      // 創建測試類別
      const category = await prisma.category.create({
        data: {
          name: 'Clothing',
          description: 'Apparel and fashion items',
        },
      });
      console.log('Created category:', category.name);
      
      // 創建測試倉庫
      const warehouse = await prisma.warehouse.create({
        data: {
          name: 'Main Warehouse',
          location: 'Taipei, Taiwan',
          description: 'Main storage facility',
          createdById: adminUser.id,
          updatedById: adminUser.id,
        },
      });
      console.log('Created warehouse:', warehouse.name);
      
      // 創建測試產品
      const product = await prisma.product.create({
        data: {
          name: 'T-Shirt',
          sku: 'TS-001',
          description: 'Basic cotton t-shirt',
          sellingPrice: 29.99,
          costPrice: 15.99,
          categoryId: category.id,
          createdById: adminUser.id,
          updatedById: adminUser.id,
        },
      });
      console.log('Created product:', product.name);
      
      // 創建庫存項目
      const inventoryItem = await prisma.inventoryItem.create({
        data: {
          productId: product.id,
          warehouseId: warehouse.id,
          quantity: 100,
        },
      });
      console.log('Created inventory item with quantity:', inventoryItem.quantity);
    } else {
      console.log('Users already exist, skipping initialization');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error during deployment setup:', error);
    return { success: false, error };
  } finally {
    await prisma.$disconnect();
  }
}

// 如果這個文件被直接執行（而不是被導入）
if (require.main === module) {
  main()
    .then((result) => {
      console.log('Deployment check completed:', result);
      if (!result.success) {
        process.exit(1);
      }
    })
    .catch((e) => {
      console.error('Deployment check failed:', e);
      process.exit(1);
    });
}

export default main;
