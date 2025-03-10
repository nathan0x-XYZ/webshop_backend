"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Package, MapPin } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/shared/delete-button";
import { useToast } from "@/hooks/use-toast";

export default function WarehouseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [warehouse, setWarehouse] = useState<any>(null);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/warehouses/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch warehouse');
        }
        const warehouseData = await response.json();
        setWarehouse(warehouseData);
      } catch (error) {
        console.error('Error fetching warehouse:', error);
        toast({
          title: "Error",
          description: "Failed to load warehouse details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchInventory = async () => {
      try {
        setIsLoadingInventory(true);
        const response = await fetch(`/api/warehouses/${params.id}/inventory`);
        if (!response.ok) {
          throw new Error('Failed to fetch warehouse inventory');
        }
        const inventoryData = await response.json();
        setInventoryItems(inventoryData);
      } catch (error) {
        console.error('Error fetching warehouse inventory:', error);
        toast({
          title: "Error",
          description: "Failed to load inventory items. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingInventory(false);
      }
    };

    if (params.id) {
      fetchWarehouse();
      fetchInventory();
    }
  }, [params.id, toast]);

  const handleDelete = async (id: string) => {
    try {
      if (warehouse?.status === "Active" && warehouse.totalItems > 0) {
        throw new Error("Cannot delete a warehouse with inventory. Transfer all items first.");
      }
      
      const response = await fetch(`/api/warehouses/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete warehouse');
      }
      
      toast({
        title: "Success",
        description: "Warehouse deleted successfully",
      });
      
      router.push("/warehouses");
      return Promise.resolve();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete warehouse",
        variant: "destructive",
      });
      
      return Promise.reject(error);
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/warehouses">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {isLoading ? <Skeleton className="h-9 w-40" /> : warehouse?.name}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {!isLoading && warehouse && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/warehouses/${params.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              
              <DeleteButton
                id={params.id as string}
                name={warehouse.name}
                onDelete={handleDelete}
                disabled={warehouse.status === "Active" && warehouse.totalItems > 0}
                disabledReason="Cannot delete a warehouse with inventory. Transfer all items first."
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
      ) : warehouse ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Warehouse Details
              </CardTitle>
              <CardDescription>
                Information about this warehouse location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                  <p className="text-base">{warehouse.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <div className="mt-1">
                    {warehouse.status === "Active" ? (
                      <Badge className="bg-emerald-500">Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="text-base">{warehouse.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Items</h3>
                <p className="text-base">{warehouse.totalItems || 0}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Inventory Items
              </CardTitle>
              <CardDescription>
                Products currently stored in this warehouse
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingInventory ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : inventoryItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground mb-4">No inventory items found in this warehouse</p>
                  <Button asChild>
                    <Link href="/transfers/new">
                      Add Inventory
                    </Link>
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.sku}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <h2 className="text-xl font-semibold mb-2">Warehouse Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The warehouse you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/warehouses">Back to Warehouses</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}