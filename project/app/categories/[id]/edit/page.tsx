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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// 定義類別的類型
interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  status: string;
}

// 擴展 Window 接口
declare global {
  interface Window {
    updatedCategories: Category[];
  }
}

// Mock categories data - this would normally be in a database
const mockCategories: Category[] = [
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

const categorySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string(),
  status: z.enum(["Active", "Inactive"]),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      status: "Active",
    },
  });

  useEffect(() => {
    // Fetch category data
    const fetchCategory = async () => {
      setIsFetching(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/categories/${params.id}`);
        // const data = await response.json();
        
        // Get data from our mock database (window.updatedCategories)
        setTimeout(() => {
          const categories = typeof window !== 'undefined' ? window.updatedCategories : mockCategories;
          const foundCategory = categories.find(c => c.id === params.id);
          
          if (foundCategory) {
            setCategory(foundCategory);
            form.reset({
              name: foundCategory.name,
              description: foundCategory.description,
              status: foundCategory.status as "Active" | "Inactive",
            });
          }
          
          setIsFetching(false);
        }, 1000);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load category details",
          variant: "destructive",
        });
        setIsFetching(false);
      }
    };

    fetchCategory();
  }, [params.id, toast, form]);

  async function onSubmit(data: CategoryFormValues) {
    setIsLoading(true);
    
    try {
      // In a real application, this would be an API call
      // const response = await fetch(`/api/categories/${params.id}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // });
      
      // if (!response.ok) {
      //   throw new Error("Failed to update category");
      // }
      
      // Simulate API call and update our mock database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the category in our mock database
      if (typeof window !== 'undefined') {
        const index = window.updatedCategories.findIndex(c => c.id === params.id);
        if (index !== -1) {
          window.updatedCategories[index] = {
            ...window.updatedCategories[index],
            ...data
          };
          
          // Log the updated categories for debugging
          console.log("Updated categories:", window.updatedCategories);
        }
      }
      
      toast({
        title: "Category updated",
        description: "The category has been updated successfully.",
      });
      
      router.push(`/categories/${params.id}`);
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
          <Link href={`/categories/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isFetching ? <Skeleton className="h-9 w-40" /> : `Edit ${category?.name}`}
        </h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
          <CardDescription>
            Update the category details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Category Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Category description..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A brief description of what products belong in this category
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/categories/${params.id}`)}
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