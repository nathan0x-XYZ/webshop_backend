const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  console.log('正在檢查數據庫中的用戶...');

  try {
    // 獲取所有用戶
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('數據庫中的用戶列表:');
    console.log('---------------------------');
    
    users.forEach(user => {
      console.log(`ID: ${user.id}`);
      console.log(`姓名: ${user.name}`);
      console.log(`郵箱: ${user.email}`);
      console.log(`角色: ${user.role}`);
      console.log(`創建時間: ${user.createdAt}`);
      console.log(`更新時間: ${user.updatedAt}`);
      console.log('---------------------------');
    });

    console.log(`共找到 ${users.length} 個用戶`);
  } catch (error) {
    console.error('檢查用戶時出錯:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
