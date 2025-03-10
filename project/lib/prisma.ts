// Mock implementation of PrismaClient for WebContainer environment
// This is a simplified version that doesn't require native bindings

import { UserRole } from '@prisma/client';
import { mockUsers, mockCategories, mockProducts, mockWarehouses, mockInventoryItems } from './mock-data';

// Define types for query parameters
interface WhereUniqueInput {
  id?: string;
  email?: string;
  [key: string]: any;
}

interface FindUniqueArgs {
  where: WhereUniqueInput;
  include?: any;
  select?: any;
}

interface FindManyArgs {
  where?: any;
  include?: any;
  select?: any;
  orderBy?: any;
  skip?: number;
  take?: number;
}

interface CreateArgs {
  data: any;
  include?: any;
  select?: any;
}

interface UpdateArgs {
  where: WhereUniqueInput;
  data: any;
  include?: any;
  select?: any;
}

interface DeleteArgs {
  where: WhereUniqueInput;
}

// Mock PrismaClient implementation
class MockPrismaClient {
  user = {
    findUnique: async ({ where }: FindUniqueArgs) => {
      console.log("Mock findUnique called with:", where);
      if (where.email) {
        const user = mockUsers.find(user => user.email === where.email);
        console.log("Found user:", user ? user.email : "none");
        return user || null;
      }
      if (where.id) {
        const user = mockUsers.find(user => user.id === where.id);
        console.log("Found user by ID:", user ? user.id : "none");
        return user || null;
      }
      return null;
    },
    findMany: async (args?: FindManyArgs) => {
      return mockUsers;
    },
    create: async ({ data }: CreateArgs) => {
      const newUser = {
        id: String(mockUsers.length + 1),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockUsers.push(newUser);
      return newUser;
    },
    update: async ({ where, data }: UpdateArgs) => {
      const index = mockUsers.findIndex(user => user.id === where.id);
      if (index !== -1) {
        mockUsers[index] = {
          ...mockUsers[index],
          ...data,
          updatedAt: new Date()
        };
        return mockUsers[index];
      }
      throw new Error('User not found');
    },
    delete: async ({ where }: DeleteArgs) => {
      const index = mockUsers.findIndex(user => user.id === where.id);
      if (index !== -1) {
        const deletedUser = mockUsers[index];
        mockUsers.splice(index, 1);
        return deletedUser;
      }
      throw new Error('User not found');
    }
  };

  category = {
    findUnique: async ({ where }: FindUniqueArgs) => {
      if (where.id) {
        return mockCategories.find(category => category.id === where.id) || null;
      }
      if (where.name) {
        return mockCategories.find(category => category.name === where.name) || null;
      }
      return null;
    },
    findMany: async (args?: FindManyArgs) => {
      return mockCategories;
    },
    create: async ({ data }: CreateArgs) => {
      const newCategory = {
        id: String(mockCategories.length + 1),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockCategories.push(newCategory);
      return newCategory;
    },
    update: async ({ where, data }: UpdateArgs) => {
      const index = mockCategories.findIndex(category => category.id === where.id);
      if (index !== -1) {
        mockCategories[index] = {
          ...mockCategories[index],
          ...data,
          updatedAt: new Date()
        };
        return mockCategories[index];
      }
      throw new Error('Category not found');
    },
    delete: async ({ where }: DeleteArgs) => {
      const index = mockCategories.findIndex(category => category.id === where.id);
      if (index !== -1) {
        const deletedCategory = mockCategories[index];
        mockCategories.splice(index, 1);
        return deletedCategory;
      }
      throw new Error('Category not found');
    }
  };

  product = {
    findUnique: async ({ where }: FindUniqueArgs) => {
      if (where.id) {
        return mockProducts.find(product => product.id === where.id) || null;
      }
      if (where.sku) {
        return mockProducts.find(product => product.sku === where.sku) || null;
      }
      return null;
    },
    findMany: async (args?: FindManyArgs) => {
      let products = [...mockProducts];
      
      if (args?.where?.categoryId) {
        products = products.filter(product => product.categoryId === args.where.categoryId);
      }
      
      return products;
    },
    create: async ({ data }: CreateArgs) => {
      const newProduct = {
        id: String(mockProducts.length + 1),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockProducts.push(newProduct);
      return newProduct;
    },
    update: async ({ where, data }: UpdateArgs) => {
      const index = mockProducts.findIndex(product => product.id === where.id);
      if (index !== -1) {
        mockProducts[index] = {
          ...mockProducts[index],
          ...data,
          updatedAt: new Date()
        };
        return mockProducts[index];
      }
      throw new Error('Product not found');
    },
    delete: async ({ where }: DeleteArgs) => {
      const index = mockProducts.findIndex(product => product.id === where.id);
      if (index !== -1) {
        const deletedProduct = mockProducts[index];
        mockProducts.splice(index, 1);
        return deletedProduct;
      }
      throw new Error('Product not found');
    }
  };

  warehouse = {
    findUnique: async ({ where }: FindUniqueArgs) => {
      if (where.id) {
        return mockWarehouses.find(warehouse => warehouse.id === where.id) || null;
      }
      return null;
    },
    findMany: async (args?: FindManyArgs) => {
      return mockWarehouses;
    },
    create: async ({ data }: CreateArgs) => {
      const newWarehouse = {
        id: String(mockWarehouses.length + 1),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockWarehouses.push(newWarehouse);
      return newWarehouse;
    },
    update: async ({ where, data }: UpdateArgs) => {
      const index = mockWarehouses.findIndex(warehouse => warehouse.id === where.id);
      if (index !== -1) {
        mockWarehouses[index] = {
          ...mockWarehouses[index],
          ...data,
          updatedAt: new Date()
        };
        return mockWarehouses[index];
      }
      throw new Error('Warehouse not found');
    },
    delete: async ({ where }: DeleteArgs) => {
      const index = mockWarehouses.findIndex(warehouse => warehouse.id === where.id);
      if (index !== -1) {
        const deletedWarehouse = mockWarehouses[index];
        mockWarehouses.splice(index, 1);
        return deletedWarehouse;
      }
      throw new Error('Warehouse not found');
    }
  };

  inventoryItem = {
    findUnique: async ({ where }: FindUniqueArgs) => {
      if (where.id) {
        return mockInventoryItems.find(item => item.id === where.id) || null;
      }
      if (where.productId_warehouseId) {
        return mockInventoryItems.find(
          item => item.productId === where.productId_warehouseId.productId && 
                 item.warehouseId === where.productId_warehouseId.warehouseId
        ) || null;
      }
      return null;
    },
    findMany: async (args?: FindManyArgs) => {
      let items = [...mockInventoryItems];
      
      if (args?.where?.warehouseId) {
        items = items.filter(item => item.warehouseId === args.where.warehouseId);
      }
      
      if (args?.where?.productId) {
        items = items.filter(item => item.productId === args.where.productId);
      }
      
      return items;
    },
    create: async ({ data }: CreateArgs) => {
      const newItem = {
        id: String(mockInventoryItems.length + 1),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockInventoryItems.push(newItem);
      return newItem;
    },
    update: async ({ where, data }: UpdateArgs) => {
      const index = mockInventoryItems.findIndex(item => item.id === where.id);
      if (index !== -1) {
        mockInventoryItems[index] = {
          ...mockInventoryItems[index],
          ...data,
          updatedAt: new Date()
        };
        return mockInventoryItems[index];
      }
      throw new Error('Inventory item not found');
    },
    delete: async ({ where }: DeleteArgs) => {
      const index = mockInventoryItems.findIndex(item => item.id === where.id);
      if (index !== -1) {
        const deletedItem = mockInventoryItems[index];
        mockInventoryItems.splice(index, 1);
        return deletedItem;
      }
      throw new Error('Inventory item not found');
    }
  };

  // Add other models as needed for the application
}

// Use the mock client
const prisma = new MockPrismaClient();

export default prisma;