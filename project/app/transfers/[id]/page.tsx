"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Package, ArrowRightLeft, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { ProductTransferSelector } from "@/components/transfers/product-transfer-selector";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TransferOrder {
  id: string;
  transferNumber: string;
  sourceWarehouse: string;
  sourceWarehouseId: string;
  destWarehouse: string;
  destWarehouseId: string;
  status: string;
  transferDate: Date;
  totalItems: number;
  items: TransferItem[];
  notes?: string;
}

interface TransferItem {
  id: string;
  productId: string;
  sku: string;
  name: string;
  quantity: number;
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

export default function TransferDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [transfer, setTransfer] = useState<TransferOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<TransferItem[]>([]);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    // Fetch transfer order details
    const fetchTransfer = async () => {
      setIsLoading(true);
      try {
        // Get data from our mock database
        setTimeout(() => {
          const transfers = typeof window !== 'undefined' ? window.updatedTransfers : mockTransfers;
          const foundTransfer = transfers.find(t => t.id === params.id);
          
          if (foundTransfer) {
            setTransfer(foundTransfer);
            setItems(foundTransfer.items || []);
            
            // Determine if the transfer order is editable
            setIsEditable(foundTransfer.status === "DRAFT");
          } else {
            // Set empty arrays if transfer not found to avoid undefined errors
            setItems([]);
          }
          
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching transfer details:", error);
        toast({
          title: "Error",
          description: "Failed to load transfer order details",
          variant: "destructive",
        });
        setIsLoading(false);
        // Initialize empty arrays on error to avoid undefined errors
        setItems([]);
      }
    };

    fetchTransfer();
  }, [params.id, toast]);

  const handleDelete = async (id: string) => {
    // Simulate API call to delete transfer order
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/transfers/${id}`, { method: 'DELETE' });
        // if (!response.ok) throw new Error('Failed to delete transfer');
        
        if (transfer?.status === "COMPLETED" || transfer?.status === "PENDING") {
          reject(new Error("Cannot delete a transfer that is pending or completed."));
        } else {
          // Update our mock database
          if (typeof window !== 'undefined') {
            window.updatedTransfers = window.updatedTransfers.filter(t => t.id !== id);
          }
          
          router.push("/transfers");
          resolve();
        }
      }, 1000);
    });
  };

  const handleProductsSelected = (newItems: TransferItem[]) => {
    // Merge with existing items, avoiding duplicates by product ID
    const existingProductIds = new Set(items.map(item => item.productId));
    const filteredNewItems = newItems.filter(item => !existingProductIds.has(item.productId));
    
    const updatedItems = [...items, ...filteredNewItems];
    setItems(updatedItems);
    
    // Update the transfer order in our mock database
    updateTransferOrder(updatedItems);
  };

  const updateTransferOrder = (updatedItems: TransferItem[], status?: string) => {
    if (!transfer) return;
    
    // Calculate total items
    const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Create the updated transfer order
    const updatedTransfer = {
      ...transfer,
      items: updatedItems,
      totalItems,
      status: status || transfer.status
    };
    
    // Update the state
    setTransfer(updatedTransfer);
    setItems(updatedItems);
    
    // Update our mock database
    if (typeof window !== 'undefined') {
      const index = window.updatedTransfers.findIndex(t => t.id === transfer.id);
      if (index !== -1) {
        window.updatedTransfers[index] = updatedTransfer;
      }
    }
    
    toast({
      title: "Transfer order updated",
      description: "The transfer order has been updated successfully.",
    });
  };

  const handleCompleteTransfer = () => {
    updateTransferOrder(items, "COMPLETED");
  };

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

  // Safely check if transfer can be completed
  const canCompleteTransfer = transfer?.status === "PENDING" || 
    (transfer?.status === "DRAFT" && items && items.length > 0);

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/transfers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {isLoading ? <Skeleton className="h-9 w-40" /> : transfer?.transferNumber}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {!isLoading && transfer && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/transfers/${params.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              
              <DeleteButton
                id={params.id}
                name={transfer.transferNumber}
                onDelete={handleDelete}
                disabled={transfer.status === "COMPLETED" || transfer.status === "PENDING"}
                disabledReason="Cannot delete a transfer that is pending or completed."
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
      ) : transfer ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Transfer Details
                {getStatusBadge(transfer.status)}
              </CardTitle>
              <CardDescription>
                Detailed information about this inventory transfer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-muted-foreground">From</h3>
                  <p className="text-base font-medium">{transfer.sourceWarehouse}</p>
                </div>
                
                <ArrowRightLeft className="h-6 w-6 text-muted-foreground" />
                
                <div className="text-center">
                  <h3 className="text-sm font-medium text-muted-foreground">To</h3>
                  <p className="text-base font-medium">{transfer.destWarehouse}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Transfer Date</h3>
                  <p className="text-base">{format(transfer.transferDate, "MMM dd, yyyy")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Items</h3>
                  <p className="text-base">{transfer.totalItems}</p>
                </div>
              </div>
              
              {transfer.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                  <p className="text-base">{transfer.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Transfer Items
                </CardTitle>
                <CardDescription>
                  Products included in this transfer
                </CardDescription>
              </div>
              
              {isEditable && (
                <ProductTransferSelector 
                  onProductsSelected={handleProductsSelected}
                  existingItems={items}
                  sourceWarehouseId={transfer.sourceWarehouseId}
                />
              )}
            </CardHeader>
            <CardContent>
              {items && items.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.sku}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/products/${item.productId}`}>View Product</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {isEditable ? (
                    <div className="flex flex-col items-center">
                      <p className="mb-4">No items have been added to this transfer yet.</p>
                      <ProductTransferSelector 
                        onProductsSelected={handleProductsSelected}
                        sourceWarehouseId={transfer.sourceWarehouseId}
                      />
                    </div>
                  ) : (
                    "No items in this transfer"
                  )}
                </div>
              )}
            </CardContent>
            {canCompleteTransfer && (
              <CardFooter className="flex justify-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>
                      <Truck className="mr-2 h-4 w-4" />
                      {transfer.status === "DRAFT" ? "Start Transfer" : "Complete Transfer"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {transfer.status === "DRAFT" ? "Start Transfer" : "Complete Transfer"}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {transfer.status === "DRAFT" 
                          ? "This will mark the transfer as pending. Items will be reserved for transfer."
                          : "This will complete the transfer. Items will be moved from the source to the destination warehouse."}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => {
                        if (transfer.status === "DRAFT") {
                          updateTransferOrder(items, "PENDING");
                        } else {
                          handleCompleteTransfer();
                        }
                      }}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            )}
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <h2 className="text-xl font-semibold mb-2">Transfer Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The transfer you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/transfers">Back to Transfers</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}