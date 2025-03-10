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

// Sample data for demonstration
const sales = [
  {
    id: "1",
    salesNumber: "SO-2023-001",
    warehouse: "Main Store",
    status: "COMPLETED",
    salesDate: new Date("2023-05-18"),
    customerName: "Walk-in Customer",
    totalItems: 5,
    totalAmount: 249.95,
  },
  {
    id: "2",
    salesNumber: "SO-2023-002",
    warehouse: "Main Store",
    status: "COMPLETED",
    salesDate: new Date("2023-05-20"),
    customerName: "John Smith",
    totalItems: 3,
    totalAmount: 119.97,
  },
  {
    id: "3",
    salesNumber: "SO-2023-003",
    warehouse: "Downtown Branch",
    status: "DRAFT",
    salesDate: new Date("2023-06-01"),
    customerName: "Sarah Johnson",
    totalItems: 8,
    totalAmount: 399.92,
  },
  {
    id: "4",
    salesNumber: "SO-2023-004",
    warehouse: "Main Store",
    status: "CANCELLED",
    salesDate: new Date("2023-05-25"),
    customerName: "Michael Brown",
    totalItems: 2,
    totalAmount: 79.98,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return <Badge className="bg-emerald-500">Completed</Badge>;
    case "DRAFT":
      return <Badge variant="outline">Draft</Badge>;
    case "CANCELLED":
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function SalesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(sales);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = async (id: string) => {
    // Simulate API call to delete sales order
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const sale = data.find(s => s.id === id);
        
        if (sale?.status === "COMPLETED") {
          reject(new Error("Cannot delete a completed sales order."));
        } else {
          setData(data.filter(s => s.id !== id));
          resolve();
        }
      }, 1000);
    });
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales Orders</h1>
        <Button asChild>
          <Link href="/sales/new">
            <Plus className="mr-2 h-4 w-4" />
            New Sale
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
          <CardDescription>
            Track and manage your sales transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sales Number</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">
                      {sale.salesNumber}
                    </TableCell>
                    <TableCell>{sale.warehouse}</TableCell>
                    <TableCell>{getStatusBadge(sale.status)}</TableCell>
                    <TableCell>
                      {format(sale.salesDate, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>{sale.customerName}</TableCell>
                    <TableCell className="text-right">
                      {sale.totalItems}
                    </TableCell>
                    <TableCell className="text-right">
                      ${sale.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/sales/${sale.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/sales/${sale.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteButton
                          id={sale.id}
                          name={sale.salesNumber}
                          onDelete={handleDelete}
                          disabled={sale.status === "COMPLETED"}
                          disabledReason="Cannot delete a completed sales order."
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