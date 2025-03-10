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

export default function WarehousesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/warehouses');
        if (!response.ok) {
          throw new Error('Failed to fetch warehouses');
        }
        const warehousesData = await response.json();
        setData(warehousesData);
      } catch (error) {
        console.error('Error fetching warehouses:', error);
        toast({
          title: "Error",
          description: "Failed to load warehouses. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWarehouses();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      const warehouse = data.find(w => w.id === id);
      
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
      
      // Update local state
      setData(prevData => prevData.filter(w => w.id !== id));
      
      toast({
        title: "Success",
        description: "Warehouse deleted successfully",
      });
      
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
        <h1 className="text-3xl font-bold tracking-tight">Warehouses</h1>
        <Button asChild>
          <Link href="/warehouses/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Warehouse
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Warehouse Locations</CardTitle>
          <CardDescription>
            Manage your warehouse and store locations
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
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground mb-4">No warehouses found</p>
              <Button asChild>
                <Link href="/warehouses/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Warehouse
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Total Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((warehouse) => (
                  <TableRow key={warehouse.id}>
                    <TableCell className="font-medium">{warehouse.name}</TableCell>
                    <TableCell>{warehouse.location}</TableCell>
                    <TableCell>{warehouse.description}</TableCell>
                    <TableCell className="text-right">{warehouse.totalItems}</TableCell>
                    <TableCell>
                      {warehouse.status === "Active" ? (
                        <Badge className="bg-emerald-500">Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/warehouses/${warehouse.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/warehouses/${warehouse.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteButton
                          id={warehouse.id}
                          name={warehouse.name}
                          onDelete={handleDelete}
                          disabled={warehouse.status === "Active" && warehouse.totalItems > 0}
                          disabledReason="Cannot delete a warehouse with inventory. Transfer all items first."
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