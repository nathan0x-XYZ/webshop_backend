// @ts-nocheck

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Mock products data - this would normally be in a database
const mockProducts = [
  {
    id: "1",
    sku: "SH-001",
    name: "Cotton T-Shirt",
    description: "Comfortable cotton t-shirt for everyday wear",
    category: "Shirts",
    categories: ["1"],
    costPrice: 12.50,
    sellingPrice: 24.99,
    stock: 120,
    safetyStock: 20,
  },
  {
    id: "2",
    sku: "PA-001",
    name: "Slim Fit Jeans",
    description: "Stylish slim fit jeans for a modern look",
    category: "Pants",
    categories: ["2"],
    costPrice: 18.75,
    sellingPrice: 39.99,
    stock: 85,
    safetyStock: 15,
  },
  {
    id: "3",
    sku: "DR-001",
    name: "Summer Dress",
    description: "Light and airy dress for summer days",
    category: "Dresses",
    categories: ["3"],
    costPrice: 22.00,
    sellingPrice: 49.99,
    stock: 42,
    safetyStock: 10,
  },
  {
    id: "4",
    sku: "AC-001",
    name: "Leather Belt",
    description: "Classic leather belt with metal buckle",
    category: "Accessories",
    categories: ["4"],
    costPrice: 8.25,
    sellingPrice: 19.99,
    stock: 65,
    safetyStock: 12,
  },
  {
    id: "5",
    sku: "SH-002",
    name: "Polo Shirt",
    description: "Classic polo shirt with embroidered logo",
    category: "Shirts",
    categories: ["1"],
    costPrice: 15.00,
    sellingPrice: 29.99,
    stock: 8,
    safetyStock: 15,
  },
];

// Create a global variable to store the updated products if it doesn't exist
if (typeof window !== 'undefined' && !window.hasOwnProperty('updatedProducts')) {
  window.updatedProducts = [...mockProducts];
}

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
    status: "Active",
  },
];

// Create a global variable to store the updated categories if it doesn't exist
if (typeof window !== 'undefined' && !window.hasOwnProperty('updatedCategories')) {
  window.updatedCategories = [...mockCategories];
}

const productSchema = z.object({
  sku: z.string().min(3, { message: "SKU must be at least 3 characters" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().optional(),
  categories: z.array(z.string()).min(1, { message: "Select at least one category" }),
  sellingPrice: z.coerce
    .number()
    .positive({ message: "Selling price must be positive" }),
  safetyStock: z.coerce
    .number()
    .int()
    .nonnegative({ message: "Safety stock must be a non-negative integer" }),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [product, setProduct] = useState<any | null>(null);
  const [availableCategories, setAvailableCategories] = useState<{ id: string; name: string; status: string }[]>([]);

  // Load categories from our mock database
  useEffect(() => {
    const loadCategories = () => {
      const categories = typeof window !== 'undefined' ? window.updatedCategories : mockCategories;
      // Only show active categories
      const activeCategories = categories.filter(c => c.status === "Active").map(c => ({
        id: c.id,
        name: c.name,
        status: c.status
      }));
      setAvailableCategories(activeCategories);
    };
    
    loadCategories();
  }, []);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sku: "",
      name: "",
      description: "",
      categories: [],
      sellingPrice: 0,
      safetyStock: 0,
    },
  });

  useEffect(() => {
    // Fetch product data
    const fetchProduct = async () => {
      setIsFetching(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/products/${params.id}`);
        // const data = await response.json();
        
        // Get data from our mock database (window.updatedProducts)
        setTimeout(() => {
          const products = typeof window !== 'undefined' ? window.updatedProducts : mockProducts;
          const foundProduct = products.find(p => p.id === params.id);
          
          if (foundProduct) {
            // Ensure the product has a categories array
            if (!foundProduct.categories) {
              // If no categories array exists, create one with the categoryId
              foundProduct.categories = foundProduct.categoryId ? [foundProduct.categoryId] : [];
            }
            
            setProduct(foundProduct);
            form.reset({
              sku: foundProduct.sku,
              name: foundProduct.name,
              description: foundProduct.description || "",
              categories: foundProduct.categories || [],
              sellingPrice: foundProduct.sellingPrice,
              safetyStock: foundProduct.safetyStock,
            });
          }
          
          setIsFetching(false);
        }, 1000);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
        setIsFetching(false);
      }
    };

    fetchProduct();
  }, [params.id, toast, form]);

  async function onSubmit(data: ProductFormValues) {
    setIsLoading(true);
    
    try {
      // In a real application, this would be an API call
      // const response = await fetch(`/api/products/${params.id}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // });
      
      // if (!response.ok) {
      //   throw new Error("Failed to update product");
      // }
      
      // Simulate API call and update our mock database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the primary category name from the first category in the array
      const primaryCategoryId = data.categories[0];
      const primaryCategory = availableCategories.find(c => c.id === primaryCategoryId)?.name || "";
      
      // Update the product in our mock database
      if (typeof window !== 'undefined') {
        const index = window.updatedProducts.findIndex(p => p.id === params.id);
        if (index !== -1) {
          window.updatedProducts[index] = {
            ...window.updatedProducts[index],
            ...data,
            category: primaryCategory, // Update the primary category name for backward compatibility
            categories: data.categories, // Store all selected categories
          };
          
          // Log the updated products for debugging
          console.log("Updated products:", window.updatedProducts);
        }
      }
      
      toast({
        title: "Product updated",
        description: "The product has been updated successfully.",
      });
      
      router.push(`/products/${params.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/products/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isFetching ? <Skeleton className="h-9 w-40" /> : `Edit ${product?.name}`}
        </h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            Update the product details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input placeholder="SH-001" {...field} />
                        </FormControl>
                        <FormDescription>
                          Unique identifier for the product
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Cotton T-Shirt" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Product description..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="categories"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Categories</FormLabel>
                        <FormDescription>
                          Select one or more categories for this product
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {availableCategories.map((category) => (
                          <FormField
                            key={category.id}
                            control={form.control}
                            name="categories"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={category.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(category.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, category.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== category.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {category.name}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="sellingPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selling Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="safetyStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Safety Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum stock level before reordering
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/products/${params.id}`)}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}