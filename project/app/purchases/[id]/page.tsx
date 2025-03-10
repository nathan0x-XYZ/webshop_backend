"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Package, Calendar, Truck, ArrowRightLeft } from "lucide-react";
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
import { ProductSelector } from "@/components/purchases/product-selector";
import { Input } from "@/components/ui/input";
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

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: string;
  supplierId: string;
  status: string;
  orderDate: Date;
  deliveryDate: Date | null;
  notes?: string;
  totalItems: number;
  totalAmount: number;
  items: PurchaseItem[];
}

interface PurchaseItem {
  id: string;
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  receivedQuantity: number;
}

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

export default function PurchaseDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [purchase, setPurchase] = useState<PurchaseOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [receivedQuantities, setReceivedQuantities] = useState<Record<string, number>>({});
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    // Fetch purchase order details
    const fetchPurchase = async () => {
      setIsLoading(true);
      try {
        // Get data from our mock database
        setTimeout(() => {
          const purchases = typeof window !== 'undefined' ? window.updatedPurchases : mockPurchases;
          const foundPurchase = purchases.find(p => p.id === params.id);
          
          if (foundPurchase) {
            setPurchase(foundPurchase);
            setItems(foundPurchase.items || []);
            
            // Initialize received quantities
            const quantities: Record<string, number> = {};
            if (Array.isArray(foundPurchase.items)) {
              foundPurchase.items.forEach(item => {
                quantities[item.id] = item.receivedQuantity;
              });
            }
            setReceivedQuantities(quantities);
            
            // Determine if the purchase order is editable
            setIsEditable(foundPurchase.status === "DRAFT");
          } else {
            // Set empty arrays if purchase not found to avoid undefined errors
            setItems([]);
          }
          
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching purchase details:", error);
        toast({
          title: "Error",
          description: "Failed to load purchase order details",
          variant: "destructive",
        });
        setIsLoading(false);
        // Initialize empty arrays on error to avoid undefined errors
        setItems([]);
      }
    };

    fetchPurchase();
  }, [params.id, toast]);

  const handleDelete = async (id: string) => {
    // Simulate API call to delete purchase order
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/purchases/${id}`, { method: 'DELETE' });
        // if (!response.ok) throw new Error('Failed to delete purchase order');
        
        if (purchase?.status === "RECEIVED" || purchase?.status === "ORDERED") {
          reject(new Error("Cannot delete a purchase order that has been ordered or received."));
        } else {
          // Update our mock database
          if (typeof window !== 'undefined') {
            window.updatedPurchases = window.updatedPurchases.filter(p => p.id !== id);
          }
          
          router.push("/purchases");
          resolve();
        }
      }, 1000);
    });
  };

  const handleProductsSelected = (newItems: PurchaseItem[]) => {
    // Merge with existing items, avoiding duplicates by product ID
    const existingProductIds = new Set(items.map(item => item.productId));
    const filteredNewItems = newItems.filter(item => !existingProductIds.has(item.productId));
    
    const updatedItems = [...items, ...filteredNewItems];
    setItems(updatedItems);
    
    // Update the purchase order in our mock database
    updatePurchaseOrder(updatedItems);
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    
    // Update the purchase order in our mock database
    updatePurchaseOrder(updatedItems);
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity < 1) quantity = 1;
    
    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    );
    
    setItems(updatedItems);
    
    // Update the purchase order in our mock database
    updatePurchaseOrder(updatedItems);
  };

  const handlePriceChange = (itemId: string, unitPrice: number) => {
    if (unitPrice < 0) unitPrice = 0;
    
    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, unitPrice } : item
    );
    
    setItems(updatedItems);
    
    // Update the purchase order in our mock database
    updatePurchaseOrder(updatedItems);
  };

  const handleReceivedQuantityChange = (itemId: string, receivedQuantity: number) => {
    if (receivedQuantity < 0) receivedQuantity = 0;
    
    const item = items.find(i => i.id === itemId);
    if (item && receivedQuantity > item.quantity) {
      receivedQuantity = item.quantity;
    }
    
    setReceivedQuantities(prev => ({
      ...prev,
      [itemId]: receivedQuantity
    }));
  };

  const handleReceiveItems = () => {
    // Update the received quantities for all items
    const updatedItems = items.map(item => ({
      ...item,
      receivedQuantity: receivedQuantities[item.id] || item.receivedQuantity
    }));
    
    // Check if all items have been received
    const allReceived = updatedItems.every(item => item.receivedQuantity === item.quantity);
    
    // Update the purchase order status if all items have been received
    const updatedStatus = allReceived ? "RECEIVED" : "ORDERED";
    
    // Update the purchase order in our mock database
    updatePurchaseOrder(updatedItems, updatedStatus);
    
    toast({
      title: "Items received",
      description: "The received quantities have been updated successfully.",
    });
  };

  const updatePurchaseOrder = (updatedItems: PurchaseItem[], status?: string) => {
    if (!purchase) return;
    
    // Calculate total items and amount
    const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = updatedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    // Create the updated purchase order
    const updatedPurchase = {
      ...purchase,
      items: updatedItems,
      totalItems,
      totalAmount,
      status: status || purchase.status
    };
    
    // Update the state
    setPurchase(updatedPurchase);
    setItems(updatedItems);
    
    // Update our mock database
    if (typeof window !== 'undefined') {
      const index = window.updatedPurchases.findIndex(p => p.id === purchase.id);
      if (index !== -1) {
        window.updatedPurchases[index] = updatedPurchase;
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RECEIVED":
        return <Badge className="bg-emerald-500">Received</Badge>;
      case "ORDERED":
        return <Badge className="bg-blue-500">Ordered</Badge>;
      case "DRAFT":
        return <Badge variant="outline">Draft</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Safely check if purchase can be completed
  const canCreateTransfer = purchase?.status === "RECEIVED" && 
    Array.isArray(items) && 
    items.length > 0 && 
    items.some(item => item?.receivedQuantity > 0);

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/purchases">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {isLoading ? <Skeleton className="h-9 w-40" /> : purchase?.orderNumber}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {!isLoading && purchase && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/purchases/${params.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              
              <DeleteButton
                id={params.id}
                name={purchase.orderNumber}
                onDelete={handleDelete}
                disabled={purchase.status === "RECEIVED" || purchase.status === "ORDERED"}
                disabledReason="Cannot delete a purchase order that has been ordered or received."
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
      ) : purchase ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Purchase Order Details
                {getStatusBadge(purchase.status)}
              </CardTitle>
              <CardDescription>
                Detailed information about this purchase order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Supplier</h3>
                  <p className="text-base">{purchase.supplier}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p className="text-base">{purchase.status}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Order Date</h3>
                    <p className="text-base">{format(purchase.orderDate, "MMM dd, yyyy")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Delivery Date</h3>
                    <p className="text-base">
                      {purchase.deliveryDate 
                        ? format(purchase.deliveryDate, "MMM dd, yyyy") 
                        : "Not scheduled"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Items</h3>
                  <p className="text-base">{purchase.totalItems}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Amount</h3>
                  <p className="text-base">${purchase.totalAmount.toFixed(2)}</p>
                </div>
              </div>
              
              {purchase.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                  <p className="text-base">{purchase.notes}</p>
                </div>
              )}
            </CardContent>
            {canCreateTransfer && (
              <CardFooter className="flex justify-end">
                <Button asChild>
                  <Link href={`/transfers/new?fromPurchase=${purchase.id}`}>
                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                    Create Transfer
                  </Link>
                </Button>
              </CardFooter>
            )}
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Order Items
                </CardTitle>
                <CardDescription>
                  Products included in this purchase order
                </CardDescription>
              </div>
              
              {isEditable && (
                <ProductSelector 
                  onProductsSelected={handleProductsSelected}
                  existingItems={items}
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
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Received</TableHead>
                      {isEditable && <TableHead className="w-[70px]"></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.sku}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">
                          {isEditable ? (
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                              className="w-16 text-right"
                            />
                          ) : (
                            item.quantity
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {isEditable ? (
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => handlePriceChange(item.id, parseFloat(e.target.value) || 0)}
                              className="w-24 text-right"
                            />
                          ) : (
                            `$${item.unitPrice.toFixed(2)}`
                          )}
                        </TableCell>
                        <TableCell className="text-right">${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          {purchase.status === "ORDERED" ? (
                            <Input
                              type="number"
                              min="0"
                              max={item.quantity}
                              value={receivedQuantities[item.id] !== undefined ? receivedQuantities[item.id] : item.receivedQuantity}
                              onChange={(e) => handleReceivedQuantityChange(item.id, parseInt(e.target.value) || 0)}
                              className="w-16 text-right"
                            />
                          ) : (
                            <span className={item.receivedQuantity === item.quantity ? "text-emerald-500" : "text-amber-500"}>
                              {item.receivedQuantity} / {item.quantity}
                            </span>
                          )}
                        </TableCell>
                        {isEditable && (
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-destructive"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} className="text-right font-bold">
                        Total
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        ${items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2)}
                      </TableCell>
                      <TableCell colSpan={isEditable ? 2 : 1}></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {isEditable ? (
                    <div className="flex flex-col items-center">
                      <p className="mb-4">No items have been added to this purchase order yet.</p>
                      <ProductSelector onProductsSelected={handleProductsSelected} />
                    </div>
                  ) : (
                    "No items in this purchase order"
                  )}
                </div>
              )}
            </CardContent>
            {purchase && purchase.status === "ORDERED" && items && items.length > 0 && (
              <CardFooter className="flex justify-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>
                      <Truck className="mr-2 h-4 w-4" />
                      Receive Items
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Receive Items</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will update the received quantities for all items in this purchase order.
                        Are you sure you want to continue?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleReceiveItems}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            )}
            {purchase && purchase.status === "DRAFT" && items && items.length > 0 && (
              <CardFooter className="flex justify-end">
                <Button
                  onClick={() => updatePurchaseOrder(items, "ORDERED")}
                >
                  <Truck className="mr-2 h-4 w-4" />
                  Place Order
                </Button>
              </CardFooter>
            )}
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <h2 className="text-xl font-semibold mb-2">Purchase Order Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The purchase order you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/purchases">Back to Purchase Orders</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}