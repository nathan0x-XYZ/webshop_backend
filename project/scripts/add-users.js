const { PrismaClient, UserRole } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function addUsers() {
  console.log('開始添加用戶...');

  try {
    // 檢查用戶是否已存在
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin2@example.com' }
    });

    const existingManager = await prisma.user.findUnique({
      where: { email: 'manager@example.com' }
    });

    const existingStaff = await prisma.user.findUnique({
      where: { email: 'staff@example.com' }
    });

    // 如果用戶不存在，則創建
    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin2@example.com',
          hashedPassword: await bcrypt.hash('password123', 10),
          role: UserRole.ADMIN,
        },
      });
      console.log('已創建管理員用戶: admin2@example.com');
    } else {
      console.log('管理員用戶已存在: admin2@example.com');
    }

    if (!existingManager) {
      await prisma.user.create({
        data: {
          name: 'Manager User',
          email: 'manager@example.com',
          hashedPassword: await bcrypt.hash('password123', 10),
          role: UserRole.MANAGER,
        },
      });
      console.log('已創建經理用戶: manager@example.com');
    } else {
      console.log('經理用戶已存在: manager@example.com');
    }

    if (!existingStaff) {
      await prisma.user.create({
        data: {
          name: 'Staff User',
          email: 'staff@example.com',
          hashedPassword: await bcrypt.hash('password123', 10),
          role: UserRole.STAFF,
        },
      });
      console.log('已創建員工用戶: staff@example.com');
    } else {
      console.log('員工用戶已存在: staff@example.com');
    }

    console.log('用戶添加完成！');
  } catch (error) {
    console.error('添加用戶時出錯:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addUsers();
