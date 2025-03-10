"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Package } from "lucide-react";
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
  CardFooter,
} from "@/components/ui/card";
import { ProductSelector } from "@/components/purchases/product-selector";

const purchaseSchema = z.object({
  supplierId: z.string({ required_error: "Please select a supplier" }),
  notes: z.string().optional(),
});

type PurchaseFormValues = z.infer<typeof purchaseSchema>;

export default function NewPurchasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch('/api/suppliers');
        if (!response.ok) {
          throw new Error('Failed to fetch supplier data');
        }
        const suppliersData = await response.json();
        setSuppliers(suppliersData);
      } catch (error) {
        console.error('Error fetching supplier data:', error);
        toast({
          title: "Error",
          description: "Failed to load supplier data. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    fetchSuppliers();
    
    const handleSupplierAdded = () => {
      console.log("Supplier added event detected");
      fetchSuppliers();
    };
    
    window.addEventListener('supplierAdded', handleSupplierAdded);
    
    return () => {
      window.removeEventListener('supplierAdded', handleSupplierAdded);
    };
  }, [toast]);

  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      supplierId: "",
      notes: "",
    },
  });

  const handleProductsSelected = (newItems: any[]) => {
    const existingProductIds = new Set(items.map(item => item.productId));
    const filteredNewItems = newItems.filter(item => !existingProductIds.has(item.productId));
    
    setItems([...items, ...filteredNewItems]);
  };

  async function onSubmit(data: PurchaseFormValues) {
    setIsLoading(true);
    
    try {
      if (items.length === 0) {
        toast({
          title: "Warning",
          description: "Please add at least one product to the purchase order",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          items: items
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create purchase order");
      }
      
      const newPurchase = await response.json();
      setPurchaseId(newPurchase.id);
      
      toast({
        title: "Purchase order created",
        description: "The purchase order has been created successfully.",
      });
      
      router.push(`/purchases/${newPurchase.id}`);
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
          <Link href="/purchases">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">New Purchase Order</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Purchase Order Information</CardTitle>
          <CardDescription>
            Enter the details for the new purchase order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <FormField
                  control={form.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem className="flex-1 mr-4">
                      <FormLabel>Supplier</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        key={`supplier-select-${suppliers.length}`} 
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
                      <FormDescription>
                        Select the supplier for this purchase order
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/suppliers');
                        if (!response.ok) {
                          throw new Error('Failed to fetch supplier data');
                        }
                        const suppliersData = await response.json();
                        setSuppliers(suppliersData);
                        
                        toast({
                          title: "Success",
                          description: "Supplier list refreshed",
                        });
                      } catch (error) {
                        console.error('Error refreshing supplier data:', error);
                        toast({
                          title: "Error",
                          description: "Failed to refresh supplier data",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    Refresh Suppliers
                  </Button>
                </div>
              </div>
              
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
                    <FormDescription>
                      Add any additional information about this purchase order
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Order Items</h3>
                
                <ProductSelector onProductsSelected={handleProductsSelected} />
                
                {items.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">Selected Products</h4>
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Unit Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.productName}</TableCell>
                              <TableCell className="text-right">{item.quantity}</TableCell>
                              <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                              <TableCell className="text-right">${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell colSpan={3}>Total</TableCell>
                            <TableCell className="text-right">
                              ${items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Purchase Order"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";