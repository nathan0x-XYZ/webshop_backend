import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// 這個腳本專門用於 Vercel 部署
// 它會確保 Prisma 客戶端能夠正確連接到 Neon 數據庫，並初始化必要的數據

// 輸出環境變量（不包含敏感信息）
console.log('Environment variables:');
console.log('- IS_WEBCONTAINER:', process.env.IS_WEBCONTAINER);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- VERCEL:', process.env.VERCEL);
console.log('- VERCEL_ENV:', process.env.VERCEL_ENV);

// 創建 Prisma 客戶端實例
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  try {
    console.log('Starting Vercel deployment script...');
    
    // 嘗試連接到數據庫
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Successfully connected to the database');
    
    // 執行一個簡單的查詢以確認連接
    console.log('Testing database connection with a simple query...');
    const result = await prisma.$queryRaw`SELECT 1+1 as result`;
    console.log('Database query successful:', result);
    
    // 檢查數據庫中的表
    console.log('Checking database tables...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Database tables:', tables);
    
    // 檢查是否已有用戶
    console.log('Checking if users exist...');
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in the database`);
    
    // 如果沒有用戶，創建初始管理員用戶
    if (userCount === 0) {
      console.log('No users found, creating initial admin user');
      
      try {
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
      } catch (error) {
        console.error('Error creating initial data:', error);
        throw error; // 重新拋出錯誤以便上層捕獲
      }
    } else {
      console.log('Users already exist, skipping initialization');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error during deployment setup:', error);
    
    // 嘗試獲取更詳細的錯誤信息
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return { success: false, error };
  } finally {
    console.log('Disconnecting from database...');
    await prisma.$disconnect();
    console.log('Database disconnected');
  }
}

// 如果這個文件被直接執行（而不是被導入）
if (require.main === module) {
  console.log('Running vercel-deploy.ts script directly...');
  main()
    .then((result) => {
      console.log('Deployment check completed:', result);
      if (!result.success) {
        console.error('Deployment check failed with error:', result.error);
        process.exit(1);
      } else {
        console.log('Deployment check succeeded!');
      }
    })
    .catch((e) => {
      console.error('Deployment check failed with unhandled exception:', e);
      process.exit(1);
    });
} else {
  console.log('vercel-deploy.ts was imported, not run directly');
}

export default main;
