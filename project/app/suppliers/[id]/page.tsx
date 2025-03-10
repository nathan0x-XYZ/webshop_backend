"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, ShoppingCart, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/shared/delete-button";
import { useToast } from "@/hooks/use-toast";

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

// Create a global variable to store the updated suppliers if it doesn't exist
if (typeof window !== 'undefined' && !window.hasOwnProperty('updatedSuppliers')) {
  window.updatedSuppliers = [...mockSuppliers];
}

interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  status: string;
}

export default function SupplierDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch supplier data
    const fetchSupplier = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/suppliers/${params.id}`);
        // const data = await response.json();
        
        // Get data from our mock database (window.updatedSuppliers)
        setTimeout(() => {
          const suppliers = typeof window !== 'undefined' ? window.updatedSuppliers : mockSuppliers;
          const foundSupplier = suppliers.find(s => s.id === params.id);
          
          setSupplier(foundSupplier || null);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load supplier details",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchSupplier();
  }, [params.id, toast]);

  const handleDelete = async (id: string) => {
    // Simulate API call to delete supplier
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/suppliers/${id}`, { method: 'DELETE' });
        // if (!response.ok) throw new Error('Failed to delete supplier');
        
        if (supplier?.status === "Active") {
          reject(new Error("Cannot delete an active supplier. Deactivate it first."));
        } else {
          // Update our mock database
          if (typeof window !== 'undefined') {
            window.updatedSuppliers = window.updatedSuppliers.filter(s => s.id !== id);
          }
          
          router.push("/suppliers");
          resolve();
        }
      }, 1000);
    });
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/suppliers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {isLoading ? <Skeleton className="h-9 w-40" /> : supplier?.name}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {!isLoading && supplier && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/suppliers/${params.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              
              <DeleteButton
                id={params.id}
                name={supplier.name}
                onDelete={handleDelete}
                disabled={supplier.status === "Active"}
                disabledReason="Cannot delete an active supplier. Deactivate it first."
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
      ) : supplier ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Supplier Details
                <Badge className={supplier.status === "Active" ? "bg-emerald-500" : "bg-gray-500"}>
                  {supplier.status}
                </Badge>
              </CardTitle>
              <CardDescription>
                Detailed information about this supplier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Company Name</h3>
                  <p className="text-base">{supplier.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Contact Person</h3>
                  <p className="text-base">{supplier.contactName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-start gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                    <p className="text-base">{supplier.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                    <p className="text-base">{supplier.phone}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                  <p className="text-base">{supplier.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Purchase Orders
              </CardTitle>
              <CardDescription>
                Recent purchase orders from this supplier
              </CardDescription>
            </CardHeader>
            <CardContent>
              {supplier.id === "1" || supplier.id === "2" ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplier.id === "1" && (
                      <TableRow>
                        <TableCell className="font-medium">PO-2023-001</TableCell>
                        <TableCell>May 15, 2023</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500">Received</Badge>
                        </TableCell>
                        <TableCell className="text-right">$1,850.75</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href="/purchases/1">View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                    {supplier.id === "2" && (
                      <TableRow>
                        <TableCell className="font-medium">PO-2023-002</TableCell>
                        <TableCell>Jun 02, 2023</TableCell>
                        <TableCell>
                          <Badge className="bg-blue-500">Ordered</Badge>
                        </TableCell>
                        <TableCell className="text-right">$1,245.50</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href="/purchases/2">View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No purchase orders found for this supplier
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <h2 className="text-xl font-semibold mb-2">Supplier Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The supplier you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/suppliers">Back to Suppliers</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Add Table components for the purchase orders section
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";