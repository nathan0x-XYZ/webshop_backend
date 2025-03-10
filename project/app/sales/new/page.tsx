"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// 定義表單驗證模式
const formSchema = z.object({
  warehouseId: z.string({
    required_error: "Please select a warehouse",
  }),
  customerName: z.string().optional(),
  customerContact: z.string().optional(),
  notes: z.string().optional(),
});

// 定義商品項目驗證模式
const itemSchema = z.object({
  productId: z.string({
    required_error: "Please select a product",
  }),
  quantity: z.number({
    required_error: "Quantity is required",
  }).positive("Quantity must be positive"),
});

export default function NewSalesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [currentItem, setCurrentItem] = useState<{
    productId: string;
    quantity: number;
  }>({
    productId: "",
    quantity: 1,
  });
  const [inventoryWarnings, setInventoryWarnings] = useState<{[key: string]: string}>({});

  // 設置表單
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      warehouseId: "",
      customerName: "",
      customerContact: "",
      notes: "",
    },
  });

  // 獲取倉庫和產品數據
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 獲取倉庫列表
        const warehousesResponse = await fetch('/api/warehouses');
        if (!warehousesResponse.ok) {
          throw new Error('Failed to fetch warehouses');
        }
        const warehousesData = await warehousesResponse.json();
        setWarehouses(warehousesData);

        // 獲取產品列表
        const productsResponse = await fetch('/api/products');
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        const productsData = await productsResponse.json();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load initial data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // 添加商品項目
  const addItem = async () => {
    try {
      // 驗證項目
      itemSchema.parse(currentItem);
      
      const selectedProduct = products.find(p => p.id === currentItem.productId);
      if (!selectedProduct) {
        throw new Error("Selected product not found");
      }

      // 檢查庫存是否充足
      const warehouseId = form.getValues("warehouseId");
      if (!warehouseId) {
        toast({
          title: "Warning",
          description: "Please select a warehouse first",
          variant: "destructive",
        });
        return;
      }

      // 檢查庫存
      const inventoryResponse = await fetch(`/api/inventory?productId=${currentItem.productId}&warehouseId=${warehouseId}`);
      if (!inventoryResponse.ok) {
        throw new Error('Failed to check inventory');
      }
      const inventoryData = await inventoryResponse.json();
      
      // 計算已選擇的相同商品數量
      const existingItem = selectedItems.find(item => item.productId === currentItem.productId);
      const existingQuantity = existingItem ? existingItem.quantity : 0;
      const totalRequestedQuantity = existingQuantity + currentItem.quantity;
      
      if (inventoryData.quantity < totalRequestedQuantity) {
        // 設置庫存警告
        setInventoryWarnings({
          ...inventoryWarnings,
          [currentItem.productId]: `Insufficient stock. Available: ${inventoryData.quantity}, Requested: ${totalRequestedQuantity}`
        });
        
        toast({
          title: "Inventory Warning",
          description: `Insufficient stock for ${selectedProduct.name}. Available: ${inventoryData.quantity}, Requested: ${totalRequestedQuantity}`,
          variant: "destructive",
        });
        return;
      }
      
      // 如果庫存充足，清除警告
      const updatedWarnings = {...inventoryWarnings};
      delete updatedWarnings[currentItem.productId];
      setInventoryWarnings(updatedWarnings);

      // 檢查項目是否已存在
      if (existingItem) {
        // 更新現有項目數量
        setSelectedItems(
          selectedItems.map(item => 
            item.productId === currentItem.productId 
              ? { ...item, quantity: item.quantity + currentItem.quantity } 
              : item
          )
        );
      } else {
        // 添加新項目
        setSelectedItems([
          ...selectedItems,
          {
            productId: currentItem.productId,
            sku: selectedProduct.sku,
            name: selectedProduct.name,
            quantity: currentItem.quantity,
            unitPrice: selectedProduct.sellingPrice,
            totalPrice: selectedProduct.sellingPrice * currentItem.quantity,
          },
        ]);
      }

      // 重置當前項目
      setCurrentItem({
        productId: "",
        quantity: 1,
      });
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add item",
        variant: "destructive",
      });
    }
  };

  // 移除商品項目
  const removeItem = (productId: string) => {
    setSelectedItems(selectedItems.filter(item => item.productId !== productId));
    
    // 清除相關警告
    const updatedWarnings = {...inventoryWarnings};
    delete updatedWarnings[productId];
    setInventoryWarnings(updatedWarnings);
  };

  // 計算總金額
  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  };

  // 提交表單
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      // 驗證是否有選擇商品
      if (selectedItems.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one product",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // 檢查是否有庫存警告
      if (Object.keys(inventoryWarnings).length > 0) {
        toast({
          title: "Error",
          description: "Please resolve all inventory warnings before proceeding",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // 準備提交數據
      const salesData = {
        ...values,
        items: selectedItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        totalAmount: calculateTotal(),
      };

      // 發送到API
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(salesData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create sales order');
      }

      const result = await response.json();

      toast({
        title: "Success",
        description: `Sales order ${result.salesNumber} created successfully`,
      });

      // 導航到銷售列表頁面
      router.push('/sales');
    } catch (error) {
      console.error('Error creating sales order:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create sales order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 監聽倉庫變更，重置已選擇的商品
  const handleWarehouseChange = (warehouseId: string) => {
    if (selectedItems.length > 0) {
      if (confirm("Changing warehouse will clear all selected items. Continue?")) {
        setSelectedItems([]);
        setInventoryWarnings({});
        form.setValue("warehouseId", warehouseId);
      }
    } else {
      form.setValue("warehouseId", warehouseId);
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/sales">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">New Sales Order</h1>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Order Information</CardTitle>
                <CardDescription>
                  Enter the basic information for this sales order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="warehouseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warehouse</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={(value) => handleWarehouseChange(value)}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a warehouse" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {warehouses.map((warehouse) => (
                            <SelectItem key={warehouse.id} value={warehouse.id}>
                              {warehouse.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="Enter customer name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Contact</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="Enter customer contact"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={isSubmitting}
                          placeholder="Enter any notes for this sales order"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  Add products to this sales order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.getValues("warehouseId") ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <FormLabel>Product</FormLabel>
                        <Select
                          disabled={isSubmitting}
                          onValueChange={(value) =>
                            setCurrentItem({ ...currentItem, productId: value })
                          }
                          value={currentItem.productId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.sku} - {product.name} (${product.sellingPrice.toFixed(2)})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-32">
                        <FormLabel>Quantity</FormLabel>
                        <Input
                          type="number"
                          min="1"
                          disabled={isSubmitting}
                          value={currentItem.quantity}
                          onChange={(e) =>
                            setCurrentItem({
                              ...currentItem,
                              quantity: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          disabled={isSubmitting || !currentItem.productId || currentItem.quantity < 1}
                          onClick={addItem}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </div>

                    {selectedItems.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>SKU</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-right">Unit Price</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedItems.map((item) => (
                            <TableRow key={item.productId}>
                              <TableCell>{item.sku}</TableCell>
                              <TableCell>
                                {item.name}
                                {inventoryWarnings[item.productId] && (
                                  <div className="mt-1">
                                    <Badge variant="destructive" className="flex items-center gap-1">
                                      <AlertCircle className="h-3 w-3" />
                                      {inventoryWarnings[item.productId]}
                                    </Badge>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                ${item.unitPrice.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right">{item.quantity}</TableCell>
                              <TableCell className="text-right">
                                ${(item.unitPrice * item.quantity).toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={isSubmitting}
                                  onClick={() => removeItem(item.productId)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={4} className="text-right font-bold">
                              Total:
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              ${calculateTotal().toFixed(2)}
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No products added yet
                      </div>
                    )}
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Warehouse Required</AlertTitle>
                    <AlertDescription>
                      Please select a warehouse before adding products
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/sales">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isSubmitting || 
                    selectedItems.length === 0 || 
                    Object.keys(inventoryWarnings).length > 0
                  }
                >
                  {isSubmitting ? "Creating..." : "Create Sales Order"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      )}
    </div>
  );
}
