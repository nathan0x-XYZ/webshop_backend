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

// Mock suppliers data - this would normally be in a database
const mockSuppliers = [
  {
    id: "1",
    name: "Fashion Wholesale Co.",
    contactName: "John Smith",
    email: "john@fashionwholesale.com",
    phone: "555-123-4567",
    address: "123 Supplier St, Supplier City",
    status: "Active",
  },
  {
    id: "2",
    name: "Textile Suppliers Inc.",
    contactName: "Jane Doe",
    email: "jane@textilesuppliers.com",
    phone: "555-987-6543",
    address: "456 Textile Ave, Fabric City",
    status: "Active",
  },
  {
    id: "3",
    name: "Apparel Manufacturing Ltd.",
    contactName: "Robert Johnson",
    email: "robert@apparelmanufacturing.com",
    phone: "555-456-7890",
    address: "789 Apparel Blvd, Manufacturing Town",
    status: "Inactive",
  },
  {
    id: "4",
    name: "Fabric Importers Co.",
    contactName: "Emily Chen",
    email: "emily@fabricimporters.com",
    phone: "555-234-5678",
    address: "321 Import Road, Port City",
    status: "Active",
  },
  {
    id: "5",
    name: "Accessory Distributors",
    contactName: "Michael Brown",
    email: "michael@accessorydist.com",
    phone: "555-876-5432",
    address: "654 Accessory Lane, Fashion District",
    status: "Active",
  },
];

// Create a global variable to store the updated suppliers
if (typeof window !== 'undefined' && !window.hasOwnProperty('updatedSuppliers')) {
  window.updatedSuppliers = [...mockSuppliers];
}

const supplierSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  contactName: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address" }).optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(["Active", "Inactive"]),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

export default function EditSupplierPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [supplier, setSupplier] = useState<SupplierFormValues | null>(null);

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      contactName: "",
      email: "",
      phone: "",
      address: "",
      status: "Active",
    },
  });

  useEffect(() => {
    // Fetch supplier data
    const fetchSupplier = async () => {
      setIsFetching(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/suppliers/${params.id}`);
        // const data = await response.json();
        
        // Get data from our mock database (window.updatedSuppliers)
        setTimeout(() => {
          const suppliers = typeof window !== 'undefined' ? window.updatedSuppliers : mockSuppliers;
          const foundSupplier = suppliers.find(s => s.id === params.id);
          
          if (foundSupplier) {
            setSupplier(foundSupplier);
            form.reset({
              name: foundSupplier.name,
              contactName: foundSupplier.contactName || "",
              email: foundSupplier.email || "",
              phone: foundSupplier.phone || "",
              address: foundSupplier.address || "",
              status: foundSupplier.status as "Active" | "Inactive",
            });
          }
          
          setIsFetching(false);
        }, 1000);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load supplier details",
          variant: "destructive",
        });
        setIsFetching(false);
      }
    };

    fetchSupplier();
  }, [params.id, toast, form]);

  async function onSubmit(data: SupplierFormValues) {
    setIsLoading(true);
    
    try {
      // In a real application, this would be an API call
      // const response = await fetch(`/api/suppliers/${params.id}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // });
      
      // if (!response.ok) {
      //   throw new Error("Failed to update supplier");
      // }
      
      // Simulate API call and update our mock database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the supplier in our mock database
      if (typeof window !== 'undefined') {
        const index = window.updatedSuppliers.findIndex(s => s.id === params.id);
        if (index !== -1) {
          window.updatedSuppliers[index] = {
            ...window.updatedSuppliers[index],
            ...data
          };
          
          // Log the updated suppliers for debugging
          console.log("Updated suppliers:", window.updatedSuppliers);
        }
      }
      
      toast({
        title: "Supplier updated",
        description: "The supplier has been updated successfully.",
      });
      
      router.push(`/suppliers/${params.id}`);
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
          <Link href={`/suppliers/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isFetching ? <Skeleton className="h-9 w-40" /> : `Edit ${supplier?.name}`}
        </h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Supplier Information</CardTitle>
          <CardDescription>
            Update the supplier details
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
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Supplier Company Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input placeholder="Contact Person Name" {...field} />
                      </FormControl>
                      <FormDescription>
                        The primary contact person at this supplier
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="555-123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Supplier address..."
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
                    onClick={() => router.push(`/suppliers/${params.id}`)}
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