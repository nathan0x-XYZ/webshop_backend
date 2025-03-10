"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Package, Calendar, User } from "lucide-react";
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
import { format } from "date-fns";

interface SalesOrder {
  id: string;
  salesNumber: string;
  warehouse: string;
  status: string;
  salesDate: Date;
  customerName: string;
  customerContact?: string;
  totalItems: number;
  totalAmount: number;
  items: SalesItem[];
}

interface SalesItem {
  id: string;
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export default function SalesDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [sale, setSale] = useState<SalesOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch sales order details
    const fetchSale = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/sales/${params.id}`);
        // const data = await response.json();
        
        // Simulate API response with mock data
        setTimeout(() => {
          const mockSales = [
            {
              id: "1",
              salesNumber: "SO-2023-001",
              warehouse: "Main Store",
              status: "COMPLETED",
              salesDate: new Date("2023-05-18"),
              customerName: "Walk-in Customer",
              totalItems: 5,
              totalAmount: 249.95,
              items: [
                {
                  id: "1",
                  productId: "1",
                  sku: "SH-001",
                  name: "Cotton T-Shirt",
                  quantity: 3,
                  unitPrice: 24.99
                },
                {
                  id: "2",
                  productId: "4",
                  sku: "AC-001",
                  name: "Leather Belt",
                  quantity: 2,
                  unitPrice: 19.99
                }
              ]
            },
            {
              id: "2",
              salesNumber: "SO-2023-002",
              warehouse: "Main Store",
              status: "COMPLETED",
              salesDate: new Date("2023-05-20"),
              customerName: "John Smith",
              customerContact: "555-555-5555",
              totalItems: 3,
              totalAmount: 119.97,
              items: [
                {
                  id: "3",
                  productId: "1",
                  sku: "SH-001",
                  name: "Cotton T-Shirt",
                  quantity: 3,
                  unitPrice: 24.99
                },
                {
                  id: "4",
                  productId: "4",
                  sku: "AC-001",
                  name: "Leather Belt",
                  quantity: 1,
                  unitPrice: 19.99
                }
              ]
            },
            {
              id: "3",
              salesNumber: "SO-2023-003",
              warehouse: "Downtown Branch",
              status: "DRAFT",
              salesDate: new Date("2023-06-01"),
              customerName: "Sarah Johnson",
              customerContact: "555-123-4567",
              totalItems: 8,
              totalAmount: 399.92,
              items: [
                {
                  id: "5",
                  productId: "2",
                  sku: "PA-001",
                  name: "Slim Fit Jeans",
                  quantity: 4,
                  unitPrice: 39.99
                },
                {
                  id: "6",
                  productId: "3",
                  sku: "DR-001",
                  name: "Summer Dress",
                  quantity: 4,
                  unitPrice: 49.99
                }
              ]
            },
            {
              id: "4",
              salesNumber: "SO-2023-004",
              warehouse: "Main Store",
              status: "CANCELLED",
              salesDate: new Date("2023-05-25"),
              customerName: "Michael Brown",
              customerContact: "555-987-6543",
              totalItems: 2,
              totalAmount: 79.98,
              items: [
                {
                  id: "7",
                  productId: "5",
                  sku: "SH-002",
                  name: "Polo Shirt",
                  quantity: 2,
                  unitPrice: 29.99
                }
              ]
            }
          ];
          
          const foundSale = mockSales.find(s => s.id === params.id);
          setSale(foundSale || null);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load sales order details",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchSale();
  }, [params.id, toast]);

  const handleDelete = async (id: string) => {
    // Simulate API call to delete sales order
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/sales/${id}`, { method: 'DELETE' });
        // if (!response.ok) throw new Error('Failed to delete sales order');
        
        if (sale?.status === "COMPLETED") {
          reject(new Error("Cannot delete a completed sales order."));
        } else {
          router.push("/sales");
          resolve();
        }
      }, 1000);
    });
  };

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

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/sales">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {isLoading ? <Skeleton className="h-9 w-40" /> : sale?.salesNumber}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {!isLoading && sale && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/sales/${params.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              
              <DeleteButton
                id={params.id}
                name={sale.salesNumber}
                onDelete={handleDelete}
                disabled={sale.status === "COMPLETED"}
                disabledReason="Cannot delete a completed sales order."
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
      ) : sale ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Sales Order Details
                {getStatusBadge(sale.status)}
              </CardTitle>
              <CardDescription>
                Detailed information about this sales order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Customer</h3>
                    <p className="text-base">{sale.customerName}</p>
                    {sale.customerContact && (
                      <p className="text-sm text-muted-foreground">{sale.customerContact}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Warehouse</h3>
                  <p className="text-base">{sale.warehouse}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Sales Date</h3>
                    <p className="text-base">{format(sale.salesDate, "MMM dd, yyyy")}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p className="text-base">{sale.status}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Items</h3>
                  <p className="text-base">{sale.totalItems}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Amount</h3>
                  <p className="text-base font-medium">${sale.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Order Items
              </CardTitle>
              <CardDescription>
                Products included in this sales order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sale.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.sku}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} className="text-right font-medium">
                      Subtotal
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${sale.totalAmount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4} className="text-right font-medium">
                      Tax
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      $0.00
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4} className="text-right font-bold">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      ${sale.totalAmount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {sale.status === "COMPLETED" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>
                  Payment details for this sales order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Payment Method</span>
                    <span className="font-medium">Credit Card</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Payment Date</span>
                    <span className="font-medium">{format(sale.salesDate, "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span>Payment Status</span>
                    <Badge className="bg-emerald-500">Paid</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <h2 className="text-xl font-semibold mb-2">Sales Order Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The sales order you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/sales">Back to Sales Orders</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}