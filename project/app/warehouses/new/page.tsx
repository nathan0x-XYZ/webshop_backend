"use client";

import { useState } from "react";
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

// Mock warehouses data - this would normally be in a database
const mockWarehouses = [
  {
    id: "1",
    name: "Main Store",
    location: "789 Main St, Retail City",
    description: "Main retail location and warehouse",
    totalItems: 425,
    status: "Active",
  },
  {
    id: "2",
    name: "Downtown Branch",
    location: "101 Downtown Ave, Retail City",
    description: "Downtown retail branch",
    totalItems: 175,
    status: "Active",
  },
  {
    id: "3",
    name: "Mall Outlet",
    location: "Westfield Mall, Shopping District",
    description: "Small outlet in the shopping mall",
    totalItems: 125,
    status: "Active",
  },
  {
    id: "4",
    name: "Distribution Center",
    location: "456 Logistics Blvd, Industrial Zone",
    description: "Main distribution and storage facility",
    totalItems: 1250,
    status: "Active",
  },
  {
    id: "5",
    name: "Seasonal Pop-up",
    location: "Beach Boulevard, Tourist Area",
    description: "Seasonal location for summer collection",
    totalItems: 85,
    status: "Inactive",
  },
];

// Create a global variable to store the updated warehouses if it doesn't exist
if (typeof window !== 'undefined' && !window.hasOwnProperty('updatedWarehouses')) {
  window.updatedWarehouses = [...mockWarehouses];
}

const warehouseSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  location: z.string().min(2, { message: "Location must be at least 2 characters" }),
  description: z.string().optional(),
  status: z.enum(["Active", "Inactive"]),
});

type WarehouseFormValues = z.infer<typeof warehouseSchema>;

export default function NewWarehousePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      status: "Active",
    },
  });

  async function onSubmit(data: WarehouseFormValues) {
    setIsLoading(true);
    
    try {
      // In a real application, this would be an API call
      // const response = await fetch("/api/warehouses", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // });
      
      // if (!response.ok) {
      //   throw new Error("Failed to create warehouse");
      // }
      
      // Simulate API call and update our mock database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new warehouse with a unique ID
      const newWarehouse = {
        id: `${Date.now()}`, // Generate a unique ID
        ...data,
        totalItems: 0, // New warehouses start with 0 items
      };
      
      // Add the new warehouse to our mock database
      if (typeof window !== 'undefined') {
        window.updatedWarehouses = [...window.updatedWarehouses, newWarehouse];
      }
      
      toast({
        title: "Warehouse created",
        description: "The warehouse has been created successfully.",
      });
      
      router.push("/warehouses");
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
          <Link href="/warehouses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add New Warehouse</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Warehouse Information</CardTitle>
          <CardDescription>
            Enter the details for the new warehouse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Warehouse Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Warehouse Location" {...field} />
                    </FormControl>
                    <FormDescription>
                      The physical address or location of this warehouse
                    </FormDescription>
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
                        placeholder="Warehouse description..."
                        {...field}
                      />
                    </FormControl>
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
                  onClick={() => router.push("/warehouses")}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Warehouse"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}