"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/shared/delete-button";
import { useToast } from "@/hooks/use-toast";

// Mock categories data - this would normally be in a database
const mockCategories = [
  {
    id: "1",
    name: "Shirts",
    description: "All types of shirts and tops",
    productCount: 45,
    status: "Active",
  },
  {
    id: "2",
    name: "Pants",
    description: "All types of pants and bottoms",
    productCount: 32,
    status: "Active",
  },
  {
    id: "3",
    name: "Dresses",
    description: "All types of dresses",
    productCount: 28,
    status: "Active",
  },
  {
    id: "4",
    name: "Accessories",
    description: "Belts, hats, and other accessories",
    productCount: 56,
    status: "Active",
  },
  {
    id: "5",
    name: "Shoes",
    description: "All types of footwear",
    productCount: 37,
    status: "Active",
  },
  {
    id: "6",
    name: "Seasonal",
    description: "Seasonal items and collections",
    productCount: 12,
    status: "Inactive",
  },
];

// Create a global variable to store the updated categories if it doesn't exist
if (typeof window !== 'undefined' && !window.hasOwnProperty('updatedCategories')) {
  window.updatedCategories = [...mockCategories];
}

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  status: string;
}

export default function CategoryDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch category details
    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/categories/${params.id}`);
        // const data = await response.json();
        
        // Get data from our mock database (window.updatedCategories)
        setTimeout(() => {
          const categories = typeof window !== 'undefined' ? window.updatedCategories : mockCategories;
          const foundCategory = categories.find(c => c.id === params.id);
          
          setCategory(foundCategory || null);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load category details",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [params.id, toast]);

  const handleDelete = async (id: string) => {
    // Simulate API call to delete category
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
        // if (!response.ok) throw new Error('Failed to delete category');
        
        if (category?.status === "Active" && category.productCount > 0) {
          reject(new Error("Cannot delete a category with active products"));
        } else {
          // Update our mock database
          if (typeof window !== 'undefined') {
            window.updatedCategories = window.updatedCategories.filter(c => c.id !== id);
          }
          
          router.push("/categories");
          resolve();
        }
      }, 1000);
    });
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/categories">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {isLoading ? <Skeleton className="h-9 w-40" /> : category?.name}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {!isLoading && category && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/categories/${params.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              
              <DeleteButton
                id={params.id}
                name={category.name}
                onDelete={handleDelete}
                disabled={category.status === "Active" && category.productCount > 0}
                disabledReason="Cannot delete a category with active products"
              />
            </>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-40 mb-2" />
            <Skeleton className="h-5 w-60" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </CardContent>
        </Card>
      ) : category ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Category Details
                <Badge className={category.status === "Active" ? "bg-emerald-500" : "bg-gray-500"}>
                  {category.status}
                </Badge>
              </CardTitle>
              <CardDescription>
                Detailed information about this category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p className="text-base">{category.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Products</h3>
                  <p className="text-base">{category.productCount}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="text-base">{category.description}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Products in this Category
              </CardTitle>
              <CardDescription>
                Products that belong to the {category.name} category
              </CardDescription>
            </CardHeader>
            <CardContent>
              {category.productCount > 0 ? (
                <div className="text-center py-8">
                  <Button asChild>
                    <Link href={`/products?category=${params.id}`}>
                      View Products
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No products in this category
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <h2 className="text-xl font-semibold mb-2">Category Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The category you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/categories">Back to Categories</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}