"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteButton } from "@/components/shared/delete-button";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const productData = await response.json();
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, toast]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      
      router.push('/products');
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

  const getStockStatus = (stock: number, safetyStock: number) => {
    if (stock <= 0) {
      return { label: "Out of Stock", variant: "destructive" as const };
    } else if (stock <= safetyStock) {
      return { label: "Low Stock", variant: "destructive" as const };
    } else {
      return { label: "In Stock", variant: "outline" as const };
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Product Details</h1>
      </div>
      
      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ) : product ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{product.name}</CardTitle>
                <CardDescription>SKU: {product.sku}</CardDescription>
              </div>
              <Badge variant={getStockStatus(product.stock, product.safetyStock).variant}>
                {getStockStatus(product.stock, product.safetyStock).label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Category</h3>
                <p>{product.category || "Uncategorized"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Stock Level</h3>
                <p>{product.stock} units</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Cost Price</h3>
                <p>${product.costPrice?.toFixed(2)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Selling Price</h3>
                <p>${product.sellingPrice?.toFixed(2)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Safety Stock</h3>
                <p>{product.safetyStock} units</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Profit Margin</h3>
                <p>
                  {product.sellingPrice && product.costPrice
                    ? `${(((product.sellingPrice - product.costPrice) / product.sellingPrice) * 100).toFixed(2)}%`
                    : "N/A"}
                </p>
              </div>
            </div>
            
            {product.description && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                <p>{product.description}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href={`/products/${product.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Product
              </Link>
            </Button>
            <DeleteButton
              id={product.id}
              name={product.name}
              onDelete={handleDelete}
            />
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Product Not Found</CardTitle>
            <CardDescription>
              The product you are looking for does not exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}