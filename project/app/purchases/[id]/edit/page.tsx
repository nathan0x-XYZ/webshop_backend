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

// Mock purchase orders data
const mockPurchases = [
  {
    id: "1",
    orderNumber: "PO-2023-001",
    supplier: "Fashion Wholesale Co.",
    supplierId: "1",
    status: "RECEIVED",
    orderDate: new Date("2023-05-15"),
    deliveryDate: new Date("2023-05-25"),
    notes: "Summer collection order",
    totalItems: 120,
    totalAmount: 1850.75,
    items: [
      {
        id: "1",
        productId: "1",
        sku: "SH-001",
        name: "Cotton T-Shirt",
        quantity: 80,
        unitPrice: 12.50,
        receivedQuantity: 80
      },
      {
        id: "2",
        productId: "5",
        sku: "SH-002",
        name: "Polo Shirt",
        quantity: 40,
        unitPrice: 15.00,
        receivedQuantity: 40
      }
    ]
  },
  {
    id: "2",
    orderNumber: "PO-2023-002",
    supplier: "Textile Suppliers Inc.",
    supplierId: "2",
    status: "ORDERED",
    orderDate: new Date("2023-06-02"),
    deliveryDate: new Date("2023-06-12"),
    notes: "Fall collection pre-order",
    totalItems: 85,
    totalAmount: 1245.50,
    items: [
      {
        id: "3",
        productId: "2",
        sku: "PA-001",
        name: "Slim Fit Jeans",
        quantity: 50,
        unitPrice: 18.75,
        receivedQuantity: 0
      },
      {
        id: "4",
        productId: "3",
        sku: "DR-001",
        name: "Summer Dress",
        quantity: 35,
        unitPrice: 22.00,
        receivedQuantity: 0
      }
    ]
  },
  {
    id: "3",
    orderNumber: "PO-2023-003",
    supplier: "Apparel Manufacturing Ltd.",
    supplierId: "3",
    status: "DRAFT",
    orderDate: new Date("2023-06-10"),
    deliveryDate: null,
    notes: "Winter collection planning",
    totalItems: 200,
    totalAmount: 3200.00,
    items: [
      {
        id: "5",
        productId: "1",
        sku: "SH-001",
        name: "Cotton T-Shirt",
        quantity: 100,
        unitPrice: 12.00,
        receivedQuantity: 0
      },
      {
        id: "6",
        productId: "2",
        sku: "PA-001",
        name: "Slim Fit Jeans",
        quantity: 100,
        unitPrice: 20.00,
        receivedQuantity: 0
      }
    ]
  },
  {
    id: "4",
    orderNumber: "PO-2023-004",
    supplier: "Fashion Wholesale Co.",
    supplierId: "1",
    status: "CANCELLED",
    orderDate: new Date("2023-05-20"),
    deliveryDate: null,
    notes: "Cancelled due to pricing issues",
    totalItems: 50,
    totalAmount: 750.25,
    items: [
      {
        id: "7",
        productId: "4",
        sku: "AC-001",
        name: "Leather Belt",
        quantity: 50,
        unitPrice: 15.00,
        receivedQuantity: 0
      }
    ]
  },
];

// Create a global variable to store the updated purchases if it doesn't exist
if (typeof window !== 'undefined' && !window.hasOwnProperty('updatedPurchases')) {
  window.updatedPurchases = [...mockPurchases];
}

// Mock suppliers data
const mockSuppliers = [
  { id: "1", name: "Fashion Wholesale Co." },
  { id: "2", name: "Textile Suppliers Inc." },
  { id: "3", name: "Apparel Manufacturing Ltd." },
  { id: "4", name: "Fabric Importers Co." },
  { id: "5", name: "Accessory Distributors" },
];

// Create a global variable to store the updated suppliers if it doesn't exist
if (typeof window !== 'undefined' && !window.hasOwnProperty('updatedSuppliers')) {
  window.updatedSuppliers = [...mockSuppliers];
}

const purchaseSchema = z.object({
  supplierId: z.string({ required_error: "Please select a supplier" }),
  status: z.enum(["DRAFT", "ORDERED", "RECEIVED", "CANCELLED"]),
  deliveryDate: z.date().optional().nullable(),
  notes: z.string().optional(),
});

type PurchaseFormValues = z.infer<typeof purchaseSchema>;

export default function EditPurchasePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [purchase, setPurchase] = useState<any | null>(null);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  // Load suppliers from our mock database
  useEffect(() => {
    const loadSuppliers = () => {
      // Always fetch the latest suppliers data
      const suppliersData = typeof window !== 'undefined' && window.updatedSuppliers 
        ? window.updatedSuppliers 
        : mockSuppliers;
      setSuppliers(suppliersData);
    };
    
    loadSuppliers();
    
    // Set up an interval to refresh suppliers data every 5 seconds
    const intervalId = setInterval(loadSuppliers, 5000);
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      supplierId: "",
      status: "DRAFT",
      deliveryDate: null,
      notes: "",
    },
  });

  useEffect(() => {
    // Fetch purchase data
    const fetchPurchase = async () => {
      setIsFetching(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/purchases/${params.id}`);
        // const data = await response.json();
        
        // Get data from our mock database
        setTimeout(() => {
          const purchases = typeof window !== 'undefined' ? window.updatedPurchases : mockPurchases;
          const foundPurchase = purchases.find(p => p.id === params.id);
          
          if (foundPurchase) {
            setPurchase(foundPurchase);
            form.reset({
              supplierId: foundPurchase.supplierId,
              status: foundPurchase.status as any,
              deliveryDate: foundPurchase.deliveryDate,
              notes: foundPurchase.notes || "",
            });
          }
          
          setIsFetching(false);
        }, 1000);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load purchase order details",
          variant: "destructive",
        });
        setIsFetching(false);
      }
    };

    fetchPurchase();
  }, [params.id, toast, form]);

  const refreshSuppliers = () => {
    // Force refresh suppliers data
    const suppliersData = typeof window !== 'undefined' && window.updatedSuppliers 
      ? window.updatedSuppliers 
      : mockSuppliers;
    setSuppliers(suppliersData);
    
    toast({
      title: "Suppliers refreshed",
      description: "The suppliers list has been refreshed.",
    });
  };

  async function onSubmit(data: PurchaseFormValues) {
    setIsLoading(true);
    
    try {
      // In a real application, this would be an API call
      // const response = await fetch(`/api/purchases/${params.id}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // });
      
      // if (!response.ok) {
      //   throw new Error("Failed to update purchase order");
      // }
      
      // Simulate API call and update our mock database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the supplier name from the supplierId
      const supplier = suppliers.find(s => s.id === data.supplierId)?.name || "";
      
      // Update the purchase in our mock database
      if (typeof window !== 'undefined') {
        const index = window.updatedPurchases.findIndex(p => p.id === params.id);
        if (index !== -1) {
          window.updatedPurchases[index] = {
            ...window.updatedPurchases[index],
            ...data,
            supplier, // Add the supplier name
          };
        }
      }
      
      toast({
        title: "Purchase order updated",
        description: "The purchase order has been updated successfully.",
      });
      
      router.push(`/purchases/${params.id}`);
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
          <Link href={`/purchases/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isFetching ? <Skeleton className="h-9 w-40" /> : `Edit ${purchase?.orderNumber}`}
        </h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Purchase Order Information</CardTitle>
          <CardDescription>
            Update the purchase order details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="supplierId"
                    render={({ field }) => (
                      <FormItem className="flex-1 mr-4">
                        <FormLabel>Supplier</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a supplier" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {suppliers.map((supplier) => (
                              <SelectItem key={supplier.id} value={supplier.id}>
                                {supplier.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={refreshSuppliers}
                    className="mt-8"
                  >
                    Refresh Suppliers
                  </Button>
                </div>
                
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
                          <SelectItem value="DRAFT">Draft</SelectItem>
                          <SelectItem value="ORDERED">Ordered</SelectItem>
                          <SelectItem value="RECEIVED">Received</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
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
                          placeholder="Purchase order notes..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/purchases/${params.id}`)}
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