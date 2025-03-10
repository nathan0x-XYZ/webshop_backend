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

// Mock transfer orders data
const mockTransfers = [
  {
    id: "1",
    transferNumber: "TR-2023-001",
    sourceWarehouse: "Main Store",
    sourceWarehouseId: "1",
    destWarehouse: "Downtown Branch",
    destWarehouseId: "2",
    status: "COMPLETED",
    transferDate: new Date("2023-05-20"),
    notes: "Rebalancing inventory between stores",
    totalItems: 35,
    items: [
      {
        id: "1",
        productId: "1",
        sku: "SH-001",
        name: "Cotton T-Shirt",
        quantity: 20
      },
      {
        id: "2",
        productId: "2",
        sku: "PA-001",
        name: "Slim Fit Jeans",
        quantity: 15
      }
    ]
  },
  {
    id: "2",
    transferNumber: "TR-2023-002",
    sourceWarehouse: "Distribution Center",
    sourceWarehouseId: "4",
    destWarehouse: "Mall Outlet",
    destWarehouseId: "3",
    status: "PENDING",
    transferDate: new Date("2023-06-05"),
    notes: "Seasonal stock transfer",
    totalItems: 48,
    items: [
      {
        id: "3",
        productId: "3",
        sku: "DR-001",
        name: "Summer Dress",
        quantity: 25
      },
      {
        id: "4",
        productId: "4",
        sku: "AC-001",
        name: "Leather Belt",
        quantity: 23
      }
    ]
  },
  {
    id: "3",
    transferNumber: "TR-2023-003",
    sourceWarehouse: "Main Store",
    sourceWarehouseId: "1",
    destWarehouse: "Mall Outlet",
    destWarehouseId: "3",
    status: "DRAFT",
    transferDate: new Date("2023-06-10"),
    notes: "Summer collection transfer",
    totalItems: 25,
    items: [
      {
        id: "5",
        productId: "5",
        sku: "SH-002",
        name: "Polo Shirt",
        quantity: 25
      }
    ]
  },
  {
    id: "4",
    transferNumber: "TR-2023-004",
    sourceWarehouse: "Downtown Branch",
    sourceWarehouseId: "2",
    destWarehouse: "Seasonal Pop-up",
    destWarehouseId: "5",
    status: "CANCELLED",
    transferDate: new Date("2023-05-25"),
    notes: "Cancelled due to store closure",
    totalItems: 15,
    items: [
      {
        id: "6",
        productId: "1",
        sku: "SH-001",
        name: "Cotton T-Shirt",
        quantity: 15
      }
    ]
  },
];

// Create a global variable to store the updated transfers if it doesn't exist
if (typeof window !== 'undefined' && !window.hasOwnProperty('updatedTransfers')) {
  window.updatedTransfers = [...mockTransfers];
}

const transferSchema = z.object({
  status: z.enum(["DRAFT", "PENDING", "COMPLETED", "CANCELLED"]),
  notes: z.string().optional(),
});

type TransferFormValues = z.infer<typeof transferSchema>;

export default function EditTransferPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [transfer, setTransfer] = useState<any | null>(null);
  const [activeWarehouses, setActiveWarehouses] = useState<any[]>([]);

  // Load active warehouses
  useEffect(() => {
    const loadWarehouses = () => {
      const warehouses = typeof window !== 'undefined' ? window.updatedWarehouses : mockWarehouses;
      // Only show active warehouses
      const active = warehouses.filter(w => w.status === "Active");
      setActiveWarehouses(active);
    };
    
    loadWarehouses();
  }, []);

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      status: "DRAFT",
      notes: "",
    },
  });

  useEffect(() => {
    // Fetch transfer data
    const fetchTransfer = async () => {
      setIsFetching(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/transfers/${params.id}`);
        // const data = await response.json();
        
        // Get data from our mock database
        setTimeout(() => {
          const transfers = typeof window !== 'undefined' ? window.updatedTransfers : mockTransfers;
          const foundTransfer = transfers.find(t => t.id === params.id);
          
          if (foundTransfer) {
            setTransfer(foundTransfer);
            form.reset({
              status: foundTransfer.status as any,
              notes: foundTransfer.notes || "",
            });
          }
          
          setIsFetching(false);
        }, 1000);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load transfer order details",
          variant: "destructive",
        });
        setIsFetching(false);
      }
    };

    fetchTransfer();
  }, [params.id, toast, form]);

  async function onSubmit(data: TransferFormValues) {
    setIsLoading(true);
    
    try {
      // In a real application, this would be an API call
      // const response = await fetch(`/api/transfers/${params.id}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // });
      
      // if (!response.ok) {
      //   throw new Error("Failed to update transfer order");
      // }
      
      // Simulate API call and update our mock database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the transfer in our mock database
      if (typeof window !== 'undefined') {
        const index = window.updatedTransfers.findIndex(t => t.id === params.id);
        if (index !== -1) {
          window.updatedTransfers[index] = {
            ...window.updatedTransfers[index],
            ...data
          };
        }
      }
      
      toast({
        title: "Transfer order updated",
        description: "The transfer order has been updated successfully.",
      });
      
      router.push(`/transfers/${params.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  }
}