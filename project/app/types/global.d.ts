// 擴展 Window 接口以包含自定義屬性
interface Window {
  updatedCategories: Array<{
    id: string;
    name: string;
    description: string;
    productCount: number;
    status: string;
  }>;
}
