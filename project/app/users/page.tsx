"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
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
import { UserRole } from "@prisma/client";
import { useAuth } from "@/hooks/use-auth";

// Sample data for demonstration
const users = [
  {
    id: "1",
    name: "System Admin",
    email: "admin@example.com",
    role: UserRole.ROOT,
    lastActive: new Date(),
    status: "Active",
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin2@example.com",
    role: UserRole.ADMIN,
    lastActive: new Date(Date.now() - 86400000), // 1 day ago
    status: "Active",
  },
  {
    id: "3",
    name: "Manager User",
    email: "manager@example.com",
    role: UserRole.MANAGER,
    lastActive: new Date(Date.now() - 172800000), // 2 days ago
    status: "Active",
  },
  {
    id: "4",
    name: "Staff User",
    email: "staff@example.com",
    role: UserRole.STAFF,
    lastActive: new Date(Date.now() - 259200000), // 3 days ago
    status: "Active",
  },
  {
    id: "5",
    name: "Inactive User",
    email: "inactive@example.com",
    role: UserRole.STAFF,
    lastActive: new Date(Date.now() - 2592000000), // 30 days ago
    status: "Inactive",
  },
];

const getRoleBadge = (role: UserRole) => {
  switch (role) {
    case UserRole.ROOT:
      return <Badge className="bg-purple-500">Root</Badge>;
    case UserRole.ADMIN:
      return <Badge className="bg-blue-500">Admin</Badge>;
    case UserRole.MANAGER:
      return <Badge className="bg-green-500">Manager</Badge>;
    case UserRole.STAFF:
      return <Badge className="bg-gray-500">Staff</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
};

export default function UsersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Check if current user has permission to view this page
  const hasPermission = currentUser && (currentUser.role === UserRole.ROOT || currentUser.role === UserRole.ADMIN);

  if (!hasPermission) {
    return (
      <div className="flex flex-col gap-4 animate-in fade-in duration-500">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">
                You don't have permission to view this page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <Button asChild>
          <Link href="/users/new">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage system users and their permissions
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
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{format(user.lastActive, "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      {user.status === "Active" ? (
                        <Badge className="bg-emerald-500">Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/users/${user.id}`}>View</Link>
                      </Button>
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