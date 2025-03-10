"use client";

import Link from "next/link";
import { Plus, Edit, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteButton } from "@/components/shared/delete-button";
import { useToast } from "@/hooks/use-toast";

export default function ProductsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch product data');
        }
        const productsData = await response.json();
        setData(productsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product data:', error);
        toast({
          title: "Error",
          description: "Failed to load product data. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      // 检查产品是否有库存
      const productToDelete = data.find(product => product.id === id);
      if (productToDelete && productToDelete.stock > 0) {
        throw new Error("Cannot delete a product with inventory. Please transfer or sell all items first.");
      }
      
      // 检查产品是否有关联交易
      const checkResponse = await fetch(`/api/products/${id}/check-relations`);
      if (!checkResponse.ok) {
        const errorData = await checkResponse.json();
        throw new Error(errorData.message || 'Failed to check product relations');
      }
      
      const relationData = await checkResponse.json();
      if (relationData.hasRelations) {
        throw new Error("Cannot delete a product with related transactions. This product has been used in purchases, sales, or transfers.");
      }
      
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }
      
      setData(data.filter((product) => product.id !== id));
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      
      return Promise.resolve();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
      
      return Promise.reject(error);
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Button asChild>
          <Link href="/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>
            Manage your product inventory and pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Cost Price</TableHead>
                  <TableHead className="text-right">Selling Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No products found. Add your first product.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.sku}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right">${product.costPrice?.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${product.sellingPrice?.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        {product.stock < product.safetyStock ? (
                          <Badge variant="destructive">{product.stock}</Badge>
                        ) : (
                          product.stock
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/products/${product.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/products/${product.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DeleteButton
                            id={product.id}
                            name={product.name}
                            onDelete={handleDelete}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}