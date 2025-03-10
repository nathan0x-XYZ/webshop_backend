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
import { prisma } from "@/lib/prisma";

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

export default function InventoryAuditPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const response = await fetch('/api/inventory-audits');
        if (!response.ok) {
          throw new Error('Failed to fetch audit data');
        }
        const auditsData = await response.json();
        setData(auditsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching audit data:', error);
        toast({
          title: "Error",
          description: "Failed to load audit data. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchAudits();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/inventory-audits/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete audit');
      }
      
      setData(data.filter((a: any) => a.id !== id));
      
      toast({
        title: "Success",
        description: "Audit deleted successfully",
      });
      
      return Promise.resolve();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete audit",
        variant: "destructive",
      });
      
      return Promise.reject(error);
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Audit</h1>
        <Button asChild>
          <Link href="/inventory-audit/new">
            <Plus className="mr-2 h-4 w-4" />
            New Audit
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Audit History</CardTitle>
          <CardDescription>
            Track and manage inventory audits across warehouses
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
                  <TableHead>Audit Number</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Items Counted</TableHead>
                  <TableHead className="text-right">Discrepancies</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No audit records found. Create your first audit.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((audit: any) => (
                    <TableRow key={audit.id}>
                      <TableCell className="font-medium">
                        {audit.auditNumber}
                      </TableCell>
                      <TableCell>{audit.warehouse?.name || 'Unknown'}</TableCell>
                      <TableCell>{getStatusBadge(audit.status)}</TableCell>
                      <TableCell>
                        {format(new Date(audit.auditDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        {audit.totalItems || 0}
                      </TableCell>
                      <TableCell className="text-right">
                        {audit.status === "COMPLETED" ? (
                          <span className={audit.discrepancies > 0 ? "text-red-500 font-medium" : "text-green-500 font-medium"}>
                            {audit.discrepancies || 0}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/inventory-audit/${audit.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/inventory-audit/${audit.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DeleteButton
                            id={audit.id}
                            name={audit.auditNumber}
                            onDelete={handleDelete}
                            disabled={audit.status === "COMPLETED"}
                            disabledReason="Cannot delete a completed audit."
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}