"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, ClipboardCheck, AlertCircle } from "lucide-react";
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

interface InventoryAudit {
  id: string;
  auditNumber: string;
  warehouse: string;
  status: string;
  auditDate: Date;
  totalItems: number;
  discrepancies: number;
  items: AuditItem[];
}

interface AuditItem {
  id: string;
  productId: string;
  sku: string;
  name: string;
  systemQuantity: number;
  actualQuantity: number;
  discrepancy: number;
}

export default function AuditDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [audit, setAudit] = useState<InventoryAudit | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch audit details
    const fetchAudit = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/inventory-audit/${params.id}`);
        // const data = await response.json();
        
        // Simulate API response with mock data
        setTimeout(() => {
          const mockAudits = [
            {
              id: "1",
              auditNumber: "IA-2023-001",
              warehouse: "Main Store",
              status: "COMPLETED",
              auditDate: new Date("2023-05-30"),
              totalItems: 125,
              discrepancies: 3,
              items: [
                {
                  id: "1",
                  productId: "1",
                  sku: "SH-001",
                  name: "Cotton T-Shirt",
                  systemQuantity: 75,
                  actualQuantity: 73,
                  discrepancy: -2
                },
                {
                  id: "2",
                  productId: "2",
                  sku: "PA-001",
                  name: "Slim Fit Jeans",
                  systemQuantity: 45,
                  actualQuantity: 45,
                  discrepancy: 0
                },
                {
                  id: "3",
                  productId: "4",
                  sku: "AC-001",
                  name: "Leather Belt",
                  systemQuantity: 50,
                  actualQuantity: 49,
                  discrepancy: -1
                }
              ]
            },
            {
              id: "2",
              auditNumber: "IA-2023-002",
              warehouse: "Downtown Branch",
              status: "IN_PROGRESS",
              auditDate: new Date("2023-06-15"),
              totalItems: 85,
              discrepancies: 0,
              items: [
                {
                  id: "4",
                  productId: "1",
                  sku: "SH-001",
                  name: "Cotton T-Shirt",
                  systemQuantity: 50,
                  actualQuantity: 0,
                  discrepancy: 0
                },
                {
                  id: "5",
                  productId: "2",
                  sku: "PA-001",
                  name: "Slim Fit Jeans",
                  systemQuantity: 25,
                  actualQuantity: 0,
                  discrepancy: 0
                },
                {
                  id: "6",
                  productId: "3",
                  sku: "DR-001",
                  name: "Summer Dress",
                  systemQuantity: 10,
                  actualQuantity: 0,
                  discrepancy: 0
                }
              ]
            },
            {
              id: "3",
              auditNumber: "IA-2023-003",
              warehouse: "Mall Outlet",
              status: "DRAFT",
              auditDate: new Date("2023-06-20"),
              totalItems: 65,
              discrepancies: 0,
              items: []
            },
            {
              id: "4",
              auditNumber: "IA-2023-004",
              warehouse: "Distribution Center",
              status: "COMPLETED",
              auditDate: new Date("2023-04-15"),
              totalItems: 250,
              discrepancies: 12,
              items: [
                {
                  id: "7",
                  productId: "1",
                  sku: "SH-001",
                  name: "Cotton T-Shirt",
                  systemQuantity: 100,
                  actualQuantity: 95,
                  discrepancy: -5
                },
                {
                  id: "8",
                  productId: "2",
                  sku: "PA-001",
                  name: "Slim Fit Jeans",
                  systemQuantity: 75,
                  actualQuantity: 70,
                  discrepancy: -5
                },
                {
                  id: "9",
                  productId: "5",
                  sku: "SH-002",
                  name: "Polo Shirt",
                  systemQuantity: 75,
                  actualQuantity: 73,
                  discrepancy: -2
                }
              ]
            }
          ];
          
          const foundAudit = mockAudits.find(a => a.id === params.id);
          setAudit(foundAudit || null);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load audit details",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchAudit();
  }, [params.id, toast]);

  const handleDelete = async (id: string) => {
    // Simulate API call to delete audit
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/inventory-audit/${id}`, { method: 'DELETE' });
        // if (!response.ok) throw new Error('Failed to delete audit');
        
        if (audit?.status === "COMPLETED") {
          reject(new Error("Cannot delete a completed audit."));
        } else {
          router.push("/inventory-audit");
          resolve();
        }
      }, 1000);
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-emerald-500">Completed</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "DRAFT":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDiscrepancyClass = (discrepancy: number) => {
    if (discrepancy === 0) return "text-emerald-500";
    if (discrepancy < 0) return "text-red-500";
    return "text-amber-500";
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/inventory-audit">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {isLoading ? <Skeleton className="h-9 w-40" /> : audit?.auditNumber}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {!isLoading && audit && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/inventory-audit/${params.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              
              <DeleteButton
                id={params.id}
                name={audit.auditNumber}
                onDelete={handleDelete}
                disabled={audit.status === "COMPLETED"}
                disabledReason="Cannot delete a completed audit."
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
      ) : audit ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Audit Details
                {getStatusBadge(audit.status)}
              </CardTitle>
              <CardDescription>
                Detailed information about this inventory audit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Warehouse</h3>
                  <p className="text-base">{audit.warehouse}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Audit Date</h3>
                  <p className="text-base">{format(audit.auditDate, "MMM dd, yyyy")}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Items</h3>
                  <p className="text-base">{audit.totalItems}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Discrepancies</h3>
                  <p className={`text-base ${audit.discrepancies > 0 ? "text-red-500 font-medium" : "text-emerald-500 font-medium"}`}>
                    {audit.discrepancies}
                  </p>
                </div>
              </div>
              
              {audit.status === "COMPLETED" && audit.discrepancies > 0 && (
                <div className="flex items-center p-4 bg-amber-50 border border-amber-200 rounded-md">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                  <p className="text-sm text-amber-700">
                    This audit has {audit.discrepancies} discrepancies. Inventory adjustments may be needed.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Audit Items
              </CardTitle>
              <CardDescription>
                Products counted in this inventory audit
              </CardDescription>
            </CardHeader>
            <CardContent>
              {audit.items.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">System Qty</TableHead>
                      <TableHead className="text-right">Actual Qty</TableHead>
                      <TableHead className="text-right">Discrepancy</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {audit.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.sku}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.systemQuantity}</TableCell>
                        <TableCell className="text-right">
                          {audit.status === "IN_PROGRESS" && item.actualQuantity === 0 ? (
                            <Badge variant="outline">Not Counted</Badge>
                          ) : (
                            item.actualQuantity
                          )}
                        </TableCell>
                        <TableCell className={`text-right ${getDiscrepancyClass(item.discrepancy)}`}>
                          {audit.status === "COMPLETED" ? item.discrepancy : "-"}
                        </TableCell>
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
                  {audit.status === "DRAFT" ? (
                    <div className="flex flex-col items-center">
                      <p className="mb-4">No items have been added to this audit yet.</p>
                      <Button asChild>
                        <Link href={`/inventory-audit/${params.id}/edit`}>Add Items</Link>
                      </Button>
                    </div>
                  ) : (
                    "No items in this audit"
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          {audit.status === "COMPLETED" && audit.discrepancies !== 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Adjustment Actions</CardTitle>
                <CardDescription>
                  Actions taken to resolve inventory discrepancies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div>
                      <p className="font-medium">System Inventory Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(audit.auditDate.getTime() + 86400000), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <Badge className="bg-emerald-500">Completed</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div>
                      <p className="font-medium">Investigation Report</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(audit.auditDate.getTime() + 172800000), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <Badge className="bg-emerald-500">Completed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <h2 className="text-xl font-semibold mb-2">Audit Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The inventory audit you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/inventory-audit">Back to Inventory Audits</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}