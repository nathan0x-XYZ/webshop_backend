"use client";

import Link from "next/link";
import { Plus, Edit, Eye } from "lucide-react";
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

export default function CategoriesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(mockCategories);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate data loading and get data from our mock database
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        setData(window.updatedCategories);
      }
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = async (id: string) => {
    // Simulate API call to delete category
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const category = data.find(c => c.id === id);
        
        if (category?.status === "Active" && category.productCount > 0) {
          reject(new Error("Cannot delete a category with active products"));
        } else {
          // Update our mock database
          const updatedData = data.filter(c => c.id !== id);
          setData(updatedData);
          
          if (typeof window !== 'undefined') {
            window.updatedCategories = updatedData;
          }
          
          resolve();
        }
      }, 1000);
    });
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Product Categories</h1>
        <Button asChild>
          <Link href="/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Manage product categories and classifications
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
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell className="text-right">{category.productCount}</TableCell>
                    <TableCell>
                      {category.status === "Active" ? (
                        <Badge className="bg-emerald-500">Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/categories/${category.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/categories/${category.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteButton
                          id={category.id}
                          name={category.name}
                          onDelete={handleDelete}
                          disabled={category.status === "Active" && category.productCount > 0}
                          disabledReason="Cannot delete a category with active products"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}