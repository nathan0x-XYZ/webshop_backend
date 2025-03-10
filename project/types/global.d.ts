// 全局類型定義

// 產品類型
interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category?: string;
  categories?: string[];
  costPrice?: number;
  sellingPrice?: number;
  price?: number;
  cost?: number;
  stock: number;
  safetyStock: number;
  categoryId?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 類別類型
interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  status: string;
}

// 倉庫類型
interface Warehouse {
  id: string;
  name: string;
  location: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// 供應商類型
interface Supplier {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  notes: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// 採購項目類型
interface PurchaseItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product?: Product;
}

// 採購訂單類型
interface Purchase {
  id: string;
  purchaseNumber: string;
  supplierId: string;
  warehouseId: string;
  status: string;
  notes: string;
  totalAmount: number;
  items: PurchaseItem[];
  supplier?: Supplier;
  warehouse?: Warehouse;
  createdAt: string;
  updatedAt: string;
}

// 轉移項目類型
interface TransferItem {
  id: string;
  productId: string;
  quantity: number;
  product?: Product;
}

// 庫存轉移類型
interface Transfer {
  id: string;
  transferNumber: string;
  sourceWarehouseId: string;
  destinationWarehouseId: string;
  status: string;
  notes: string;
  items: TransferItem[];
  sourceWarehouse?: Warehouse;
  destinationWarehouse?: Warehouse;
  createdAt: string;
  updatedAt: string;
}

// 刪除按鈕 Props
interface DeleteButtonProps {
  id: string;
  name: string;
  onDelete: (id: string) => Promise<void>;
  disabled?: boolean;
  disabledReason?: string;
}

// 擴展 Window 接口
declare global {
  interface Window {
    updatedProducts: Product[];
    updatedCategories: Category[];
    updatedWarehouses: Warehouse[];
    updatedSuppliers: Supplier[];
    updatedPurchases: Purchase[];
    updatedTransfers: Transfer[];
  }
}

export {};
