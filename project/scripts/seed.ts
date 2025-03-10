import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clean up existing data
  await prisma.auditItem.deleteMany();
  await prisma.inventoryAudit.deleteMany();
  await prisma.salesItem.deleteMany();
  await prisma.salesOrder.deleteMany();
  await prisma.transferItem.deleteMany();
  await prisma.transferOrder.deleteMany();
  await prisma.purchaseItem.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating users...');
  
  // Create root user
  const rootUser = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@example.com',
      hashedPassword: await bcrypt.hash('password123', 10),
      role: UserRole.ROOT,
    },
  });

  // Create other users
  const adminUser = await prisma.user.create({ data: {
      name: 'Admin User',
      email: 'admin2@example.com',
      hashedPassword: await bcrypt.hash('password123', 10),
      role: UserRole.ADMIN,
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      name: 'Manager User',
      email: 'manager@example.com',
      hashedPassword: await bcrypt.hash('password123', 10),
      role: UserRole.MANAGER,
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      name: 'Staff User',
      email: 'staff@example.com',
      hashedPassword: await bcrypt.hash('password123', 10),
      role: UserRole.STAFF,
    },
  });

  console.log('Creating categories...');
  
  // Create categories
  const shirtsCategory = await prisma.category.create({
    data: {
      name: 'Shirts',
      description: 'All types of shirts and tops',
    },
  });

  const pantsCategory = await prisma.category.create({
    data: {
      name: 'Pants',
      description: 'All types of pants and bottoms',
    },
  });

  const dressesCategory = await prisma.category.create({
    data: {
      name: 'Dresses',
      description: 'All types of dresses',
    },
  });

  const accessoriesCategory = await prisma.category.create({
    data: {
      name: 'Accessories',
      description: 'Belts, hats, and other accessories',
    },
  });

  const shoesCategory = await prisma.category.create({
    data: {
      name: 'Shoes',
      description: 'All types of footwear',
    },
  });

  console.log('Creating products...');
  
  // Create products
  const tshirt = await prisma.product.create({
    data: {
      sku: 'SH-001',
      name: 'Cotton T-Shirt',
      description: 'Comfortable cotton t-shirt for everyday wear',
      sellingPrice: 24.99,
      safetyStock: 20,
      categoryId: shirtsCategory.id,
      createdById: rootUser.id,
      updatedById: rootUser.id,
    },
  });

  const jeans = await prisma.product.create({
    data: {
      sku: 'PA-001',
      name: 'Slim Fit Jeans',
      description: 'Stylish slim fit jeans for a modern look',
      sellingPrice: 39.99,
      safetyStock: 15,
      categoryId: pantsCategory.id,
      createdById: rootUser.id,
      updatedById: rootUser.id,
    },
  });

  const dress = await prisma.product.create({
    data: {
      sku: 'DR-001',
      name: 'Summer Dress',
      description: 'Light and airy dress for summer days',
      sellingPrice: 49.99,
      safetyStock: 10,
      categoryId: dressesCategory.id,
      createdById: rootUser.id,
      updatedById: rootUser.id,
    },
  });

  const belt = await prisma.product.create({
    data: {
      sku: 'AC-001',
      name: 'Leather Belt',
      description: 'Classic leather belt with metal buckle',
      sellingPrice: 19.99,
      safetyStock: 12,
      categoryId: accessoriesCategory.id,
      createdById: rootUser.id,
      updatedById: rootUser.id,
    },
  });

  const polo = await prisma.product.create({
    data: {
      sku: 'SH-002',
      name: 'Polo Shirt',
      description: 'Classic polo shirt with embroidered logo',
      sellingPrice: 29.99,
      safetyStock: 15,
      categoryId: shirtsCategory.id,
      createdById: rootUser.id,
      updatedById: rootUser.id,
    },
  });

  console.log('Creating suppliers...');
  
  // Create suppliers
  const supplier1 = await prisma.supplier.create({
    data: {
      name: 'Fashion Wholesale Co.',
      contactName: 'John Smith',
      email: 'john@fashionwholesale.com',
      phone: '555-123-4567',
      address: '123 Supplier St, Supplier City',
      createdById: rootUser.id,
      updatedById: rootUser.id,
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: 'Textile Suppliers Inc.',
      contactName: 'Jane Doe',
      email: 'jane@textilesuppliers.com',
      phone: '555-987-6543',
      address: '456 Textile Ave, Fabric City',
      createdById: rootUser.id,
      updatedById: rootUser.id,
    },
  });

  console.log('Creating warehouses...');
  
  // Create warehouses
  const mainWarehouse = await prisma.warehouse.create({
    data: {
      name: 'Main Store',
      location: '789 Main St, Retail City',
      description: 'Main retail location and warehouse',
      createdById: rootUser.id,
      updatedById: rootUser.id,
    },
  });

  const secondaryWarehouse = await prisma.warehouse.create({
    data: {
      name: 'Downtown Branch',
      location: '101 Downtown Ave, Retail City',
      description: 'Downtown retail branch',
      createdById: rootUser.id,
      updatedById: rootUser.id,
    },
  });

  console.log('Creating inventory items...');
  
  // Create inventory items
  await prisma.inventoryItem.create({
    data: {
      productId: tshirt.id,
      warehouseId: mainWarehouse.id,
      quantity: 100,
    },
  });

  await prisma.inventoryItem.create({
    data: {
      productId: tshirt.id,
      warehouseId: secondaryWarehouse.id,
      quantity: 50,
    },
  });

  await prisma.inventoryItem.create({
    data: {
      productId: jeans.id,
      warehouseId: mainWarehouse.id,
      quantity: 75,
    },
  });

  await prisma.inventoryItem.create({
    data: {
      productId: jeans.id,
      warehouseId: secondaryWarehouse.id,
      quantity: 25,
    },
  });

  await prisma.inventoryItem.create({
    data: {
      productId: dress.id,
      warehouseId: mainWarehouse.id,
      quantity: 40,
    },
  });

  await prisma.inventoryItem.create({
    data: {
      productId: belt.id,
      warehouseId: mainWarehouse.id,
      quantity: 60,
    },
  });

  await prisma.inventoryItem.create({
    data: {
      productId: polo.id,
      warehouseId: mainWarehouse.id,
      quantity: 8,
    },
  });

  console.log('Creating purchase orders...');
  
  // Create purchase orders
  const purchaseOrder1 = await prisma.purchaseOrder.create({
    data: {
      orderNumber: 'PO-2023-001',
      supplierId: supplier1.id,
      status: 'RECEIVED',
      orderDate: new Date('2023-05-15'),
      deliveryDate: new Date('2023-05-25'),
      notes: 'Summer collection order',
      createdById: rootUser.id,
      updatedById: rootUser.id,
      items: {
        create: [
          {
            productId: tshirt.id,
            quantity: 100,
            unitPrice: 12.50,
            receivedQuantity: 100,
          },
          {
            productId: polo.id,
            quantity: 50,
            unitPrice: 15.00,
            receivedQuantity: 50,
          },
        ],
      },
    },
  });

  const purchaseOrder2 = await prisma.purchaseOrder.create({
    data: {
      orderNumber: 'PO-2023-002',
      supplierId: supplier2.id,
      status: 'ORDERED',
      orderDate: new Date('2023-06-02'),
      deliveryDate: new Date('2023-06-12'),
      notes: 'Fall collection pre-order',
      createdById: rootUser.id,
      updatedById: rootUser.id,
      items: {
        create: [
          {
            productId: jeans.id,
            quantity: 75,
            unitPrice: 18.75,
            receivedQuantity: 0,
          },
          {
            productId: dress.id,
            quantity: 50,
            unitPrice: 22.00,
            receivedQuantity: 0,
          },
        ],
      },
    },
  });

  console.log('Creating transfer orders...');
  
  // Create transfer orders
  const transferOrder = await prisma.transferOrder.create({
    data: {
      transferNumber: 'TR-2023-001',
      sourceWarehouseId: mainWarehouse.id,
      destWarehouseId: secondaryWarehouse.id,
      status: 'COMPLETED',
      transferDate: new Date('2023-05-20'),
      notes: 'Rebalancing inventory between stores',
      createdById: rootUser.id,
      updatedById: rootUser.id,
      items: {
        create: [
          {
            productId: tshirt.id,
            quantity: 20,
          },
          {
            productId: jeans.id,
            quantity: 15,
          },
        ],
      },
    },
  });

  console.log('Creating sales orders...');
  
  // Create sales orders
  const salesOrder1 = await prisma.salesOrder.create({
    data: {
      salesNumber: 'SO-2023-001',
      warehouseId: mainWarehouse.id,
      status: 'COMPLETED',
      salesDate: new Date('2023-05-18'),
      customerName: 'Walk-in Customer',
      totalAmount: 249.95,
      createdById: rootUser.id,
      updatedById: rootUser.id,
      items: {
        create: [
          {
            productId: tshirt.id,
            quantity: 5,
            unitPrice: 24.99,
          },
          {
            productId: belt.id,
            quantity: 2,
            unitPrice: 19.99,
          },
        ],
      },
    },
  });

  const salesOrder2 = await prisma.salesOrder.create({
    data: {
      salesNumber: 'SO-2023-002',
      warehouseId: secondaryWarehouse.id,
      status: 'COMPLETED',
      salesDate: new Date('2023-05-20'),
      customerName: 'John Smith',
      customerContact: '555-555-5555',
      totalAmount: 119.97,
      createdById: rootUser.id,
      updatedById: rootUser.id,
      items: {
        create: [
          {
            productId: tshirt.id,
            quantity: 3,
            unitPrice: 24.99,
          },
          {
            productId: belt.id,
            quantity: 1,
            unitPrice: 19.99,
          },
        ],
      },
    },
  });

  console.log('Creating inventory audit...');
  
  // Create inventory audit
  const inventoryAudit = await prisma.inventoryAudit.create({
    data: {
      auditNumber: 'IA-2023-001',
      warehouseId: mainWarehouse.id,
      status: 'COMPLETED',
      auditDate: new Date('2023-05-30'),
      notes: 'Monthly inventory audit',
      createdById: rootUser.id,
      updatedById: rootUser.id,
      items: {
        create: [
          {
            productId: tshirt.id,
            systemQuantity: 75,
            actualQuantity: 73,
            discrepancy: -2,
            notes: 'Minor discrepancy found',
          },
          {
            productId: jeans.id,
            systemQuantity: 60,
            actualQuantity: 60,
            discrepancy: 0,
            notes: 'No discrepancy',
          },
          {
            productId: belt.id,
            systemQuantity: 58,
            actualQuantity: 57,
            discrepancy: -1,
            notes: 'Small discrepancy',
          },
        ],
      },
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });