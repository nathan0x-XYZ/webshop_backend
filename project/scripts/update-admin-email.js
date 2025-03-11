const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateAdminEmail() {
  console.log('正在更新 admin 用戶郵箱...');

  try {
    // 查找 admin2@example.com 用戶
    const admin = await prisma.user.findUnique({
      where: {
        email: 'admin2@example.com'
      }
    });

    if (!admin) {
      console.log('找不到 admin2@example.com 用戶');
      return;
    }

    // 更新郵箱為 admin@example.com
    const updatedAdmin = await prisma.user.update({
      where: {
        id: admin.id
      },
      data: {
        email: 'admin@example.com'
      }
    });

    console.log('成功更新 admin 用戶郵箱:');
    console.log(`ID: ${updatedAdmin.id}`);
    console.log(`姓名: ${updatedAdmin.name}`);
    console.log(`郵箱: ${updatedAdmin.email}`);
    console.log(`角色: ${updatedAdmin.role}`);
  } catch (error) {
    console.error('更新 admin 用戶郵箱時出錯:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminEmail();
