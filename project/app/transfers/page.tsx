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
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteButton } from "@/components/shared/delete-button";
import { useToast } from "@/hooks/use-toast";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return <Badge className="bg-emerald-500">Completed</Badge>;
    case "PENDING":
      return <Badge className="bg-blue-500">Pending</Badge>;
    case "DRAFT":
      return <Badge variant="outline">Draft</Badge>;
    case "CANCELLED":
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function TransfersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/transfers');
        if (!response.ok) {
          throw new Error('Failed to fetch transfers');
        }
        const transfersData = await response.json();
        setData(transfersData);
      } catch (error) {
        console.error('Error fetching transfers:', error);
        toast({
          title: "Error",
          description: "Failed to load inventory transfers. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransfers();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      const transfer = data.find(t => t.id === id);
      
      if (transfer?.status === "COMPLETED" || transfer?.status === "PENDING") {
        throw new Error("Cannot delete a transfer that is pending or completed.");
      }
      
      const response = await fetch(`/api/transfers/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete transfer');
      }
      
      // Update local state
      setData(prevData => prevData.filter(t => t.id !== id));
      
      toast({
        title: "Success",
        description: "Transfer deleted successfully",
      });
      
      return Promise.resolve();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete transfer",
        variant: "destructive",
      });
      
      return Promise.reject(error);
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Transfers</h1>
        <Button asChild>
          <Link href="/transfers/new">
            <Plus className="mr-2 h-4 w-4" />
            New Transfer
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Transfers</CardTitle>
          <CardDescription>
            Manage inventory transfers between warehouses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground mb-4">No inventory transfers found</p>
              <Button asChild>
                <Link href="/transfers/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Transfer
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transfer #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell className="font-medium">{transfer.transferNumber}</TableCell>
                    <TableCell>
                      {transfer.transferDate ? format(new Date(transfer.transferDate), 'MMM d, yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell>{transfer.sourceWarehouse}</TableCell>
                    <TableCell>{transfer.destWarehouse}</TableCell>
                    <TableCell>{transfer.totalItems || transfer.items?.length || 0}</TableCell>
                    <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/transfers/${transfer.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        
                        {transfer.status === "DRAFT" && (
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/transfers/${transfer.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        
                        {(transfer.status === "DRAFT" || transfer.status === "CANCELLED") && (
                          <DeleteButton
                            id={transfer.id}
                            name={`Transfer ${transfer.transferNumber}`}
                            onDelete={handleDelete}
                            confirmText="Are you sure you want to delete this transfer? This action cannot be undone."
                          />
                        )}
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