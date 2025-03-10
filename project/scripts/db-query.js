const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 獲取命令行參數
const args = process.argv.slice(2);
const tableName = args[0];
const limit = args[1] ? parseInt(args[1]) : 10;

async function queryDatabase() {
  if (!tableName) {
    console.log('請提供表名作為參數。例如: node db-query.js user 5');
    console.log('可用的表名:');
    console.log('- user (用戶)');
    console.log('- category (類別)');
    console.log('- product (產品)');
    console.log('- supplier (供應商)');
    console.log('- warehouse (倉庫)');
    console.log('- inventoryItem (庫存項目)');
    console.log('- purchaseOrder (採購訂單)');
    console.log('- salesOrder (銷售訂單)');
    console.log('- transferOrder (調撥訂單)');
    console.log('- inventoryAudit (庫存審計)');
    return;
  }

  try {
    console.log(`正在查詢 ${tableName} 表，限制 ${limit} 條記錄...`);
    
    let results;
    
    switch (tableName.toLowerCase()) {
      case 'user':
        results = await prisma.user.findMany({ take: limit });
        break;
      case 'category':
        results = await prisma.category.findMany({ take: limit });
        break;
      case 'product':
        results = await prisma.product.findMany({ take: limit });
        break;
      case 'supplier':
        results = await prisma.supplier.findMany({ take: limit });
        break;
      case 'warehouse':
        results = await prisma.warehouse.findMany({ take: limit });
        break;
      case 'inventoryitem':
        results = await prisma.inventoryItem.findMany({ take: limit });
        break;
      case 'purchaseorder':
        results = await prisma.purchaseOrder.findMany({ take: limit });
        break;
      case 'salesorder':
        results = await prisma.salesOrder.findMany({ take: limit });
        break;
      case 'transferorder':
        results = await prisma.transferOrder.findMany({ take: limit });
        break;
      case 'inventoryaudit':
        results = await prisma.inventoryAudit.findMany({ take: limit });
        break;
      default:
        console.log(`未知的表名: ${tableName}`);
        return;
    }

    console.log(`查詢結果 (共 ${results.length} 條記錄):`);
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('查詢數據庫時出錯:', error);
  } finally {
    await prisma.$disconnect();
  }
}

queryDatabase();
