import { UserRole } from '@prisma/client';

// Mock users data
export const mockUsers = [
  {
    id: "1",
    name: "System Admin",
    email: "admin@example.com",
    hashedPassword: "$2a$10$GQH.xZRgv2Tqn/6VSBdmPOJVyYyDrJxG4dmtVSGHbcnrGjKZbYvEe", // password123
    role: UserRole.ROOT,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin2@example.com",
    hashedPassword: "$2a$10$GQH.xZRgv2Tqn/6VSBdmPOJVyYyDrJxG4dmtVSGHbcnrGjKZbYvEe", // password123
    role: UserRole.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    name: "Manager User",
    email: "manager@example.com",
    hashedPassword: "$2a$10$GQH.xZRgv2Tqn/6VSBdmPOJVyYyDrJxG4dmtVSGHbcnrGjKZbYvEe", // password123
    role: UserRole.MANAGER,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    name: "Staff User",
    email: "staff@example.com",
    hashedPassword: "$2a$10$GQH.xZRgv2Tqn/6VSBdmPOJVyYyDrJxG4dmtVSGHbcnrGjKZbYvEe", // password123
    role: UserRole.STAFF,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock categories data
export const mockCategories = [
  {
    id: "1",
    name: "Shirts",
    description: "All types of shirts and tops",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    name: "Pants",
    description: "All types of pants and bottoms",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    name: "Dresses",
    description: "All types of dresses",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    name: "Accessories",
    description: "Belts, hats, and other accessories",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "5",
    name: "Shoes",
    description: "All types of footwear",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock products data
export const mockProducts = [
  {
    id: "1",
    sku: "SH-001",
    name: "Cotton T-Shirt",
    description: "Comfortable cotton t-shirt for everyday wear",
    costPrice: 12.50,
    sellingPrice: 24.99,
    safetyStock: 20,
    categoryId: "1", // Shirts
    createdById: "1",
    updatedById: "1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    sku: "PA-001",
    name: "Slim Fit Jeans",
    description: "Stylish slim fit jeans for a modern look",
    costPrice: 18.75,
    sellingPrice: 39.99,
    safetyStock: 15,
    categoryId: "2", // Pants
    createdById: "1",
    updatedById: "1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    sku: "DR-001",
    name: "Summer Dress",
    description: "Light and airy dress for summer days",
    costPrice: 22.00,
    sellingPrice: 49.99,
    safetyStock: 10,
    categoryId: "3", // Dresses
    createdById: "1",
    updatedById: "1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    sku: "AC-001",
    name: "Leather Belt",
    description: "Classic leather belt with metal buckle",
    costPrice: 8.25,
    sellingPrice: 19.99,
    safetyStock: 12,
    categoryId: "4", // Accessories
    createdById: "1",
    updatedById: "1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "5",
    sku: "SH-002",
    name: "Polo Shirt",
    description: "Classic polo shirt with embroidered logo",
    costPrice: 15.00,
    sellingPrice: 29.99,
    safetyStock: 15,
    categoryId: "1", // Shirts
    createdById: "1",
    updatedById: "1",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock warehouses data
export const mockWarehouses = [
  {
    id: "1",
    name: "Main Store",
    location: "789 Main St, Retail City",
    description: "Main retail location and warehouse",
    createdById: "1",
    updatedById: "1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    name: "Downtown Branch",
    location: "101 Downtown Ave, Retail City",
    description: "Downtown retail branch",
    createdById: "1",
    updatedById: "1",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock inventory items data
export const mockInventoryItems = [
  {
    id: "1",
    productId: "1", // Cotton T-Shirt
    warehouseId: "1", // Main Store
    quantity: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    productId: "1", // Cotton T-Shirt
    warehouseId: "2", // Downtown Branch
    quantity: 50,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    productId: "2", // Slim Fit Jeans
    warehouseId: "1", // Main Store
    quantity: 75,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    productId: "2", // Slim Fit Jeans
    warehouseId: "2", // Downtown Branch
    quantity: 25,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "5",
    productId: "3", // Summer Dress
    warehouseId: "1", // Main Store
    quantity: 40,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "6",
    productId: "4", // Leather Belt
    warehouseId: "1", // Main Store
    quantity: 60,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "7",
    productId: "5", // Polo Shirt
    warehouseId: "1", // Main Store
    quantity: 8,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];