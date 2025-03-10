"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Box,
  ClipboardList,
  Home,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UserRole } from "@prisma/client";
import { useAuth } from "@/hooks/use-auth";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  requiredRoles?: UserRole[];
}

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Products",
      href: "/products",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Categories",
      href: "/categories",
      icon: <Box className="h-5 w-5" />,
    },
    {
      title: "Suppliers",
      href: "/suppliers",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      title: "Warehouses",
      href: "/warehouses",
      icon: <Warehouse className="h-5 w-5" />,
    },
    {
      title: "Purchases",
      href: "/purchases",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      title: "Transfers",
      href: "/transfers",
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      title: "Sales",
      href: "/sales",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      title: "Inventory Audit",
      href: "/inventory-audit",
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      title: "Reports",
      href: "/reports",
      icon: <BarChart3 className="h-5 w-5" />,
      requiredRoles: [UserRole.ROOT, UserRole.ADMIN, UserRole.MANAGER],
    },
    {
      title: "Users",
      href: "/users",
      icon: <Users className="h-5 w-5" />,
      requiredRoles: [UserRole.ROOT, UserRole.ADMIN],
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  if (!user) {
    return null;
  }

  const filteredItems = sidebarItems.filter(
    (item) => !item.requiredRoles || item.requiredRoles.includes(user.role)
  );

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-card h-screen",
        isCollapsed ? "w-[80px]" : "w-[240px]"
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <ShoppingBag className="h-6 w-6" />
          {!isCollapsed && <span className="font-semibold">Fashion Inventory</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          )}
        </Button>
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {filteredItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "transparent",
                isCollapsed && "justify-center py-3"
              )}
            >
              {item.icon}
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <Separator />
      <div className="p-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            isCollapsed && "justify-center py-3"
          )}
          onClick={logout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}