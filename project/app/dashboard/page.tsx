"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertCircle, 
  ArrowDown, 
  ArrowUp, 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Truck 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import chart components
const DynamicCharts = dynamic(
  () => import('@/components/dashboard/charts'),
  { 
    loading: () => <ChartSkeleton />,
    ssr: false
  }
);

// Sample data for demonstration
const salesData = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 1800 },
  { name: "Mar", total: 2200 },
  { name: "Apr", total: 2600 },
  { name: "May", total: 3200 },
  { name: "Jun", total: 3800 },
  { name: "Jul", total: 4200 },
];

const inventoryData = [
  { name: "Shirts", value: 400 },
  { name: "Pants", value: 300 },
  { name: "Dresses", value: 200 },
  { name: "Accessories", value: 100 },
  { name: "Shoes", value: 150 },
];

function ChartSkeleton() {
  return (
    <div className="w-full space-y-2">
      <Skeleton className="h-[350px] w-full rounded-md" />
    </div>
  );
}

function StatCard({ title, value, icon, change, isPositive }) {
  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          <span className={`flex items-center ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? <ArrowUp className="mr-1 h-4 w-4" /> : <ArrowDown className="mr-1 h-4 w-4" />}
            {change}
          </span>{" "}
          from last month
        </p>
      </CardContent>
    </Card>
  );
}

function PurchaseItem({ number, collection, status, statusColor }) {
  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center space-x-3">
        <Truck className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="font-medium">{number}</p>
          <p className="text-sm text-muted-foreground">{collection}</p>
        </div>
      </div>
      <div className="flex items-center">
        <span className={`rounded-full ${statusColor} px-2 py-1 text-xs font-medium`}>
          {status}
        </span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<Skeleton className="h-[120px] w-full rounded-md" />}>
          <StatCard 
            title="Total Revenue" 
            value="$45,231.89" 
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            change="+20.1%" 
            isPositive={true}
          />
        </Suspense>
        
        <Suspense fallback={<Skeleton className="h-[120px] w-full rounded-md" />}>
          <StatCard 
            title="Sales" 
            value="+573" 
            icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
            change="+12.5%" 
            isPositive={true}
          />
        </Suspense>
        
        <Suspense fallback={<Skeleton className="h-[120px] w-full rounded-md" />}>
          <StatCard 
            title="Active Products" 
            value="1,324" 
            icon={<Package className="h-4 w-4 text-muted-foreground" />}
            change="+7.2%" 
            isPositive={true}
          />
        </Suspense>
        
        <Suspense fallback={<Skeleton className="h-[120px] w-full rounded-md" />}>
          <StatCard 
            title="Low Stock Items" 
            value="24" 
            icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
            change="+12" 
            isPositive={false}
          />
        </Suspense>
      </div>
      
      <Tabs 
        defaultValue="overview" 
        className="space-y-4"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>
                Monthly sales performance for the current year
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              {activeTab === "overview" && (
                <Suspense fallback={<ChartSkeleton />}>
                  <DynamicCharts type="line" data={salesData} />
                </Suspense>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Distribution</CardTitle>
              <CardDescription>
                Current inventory levels by product category
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              {activeTab === "inventory" && (
                <Suspense fallback={<ChartSkeleton />}>
                  <DynamicCharts type="bar" data={inventoryData} />
                </Suspense>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="purchases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Purchase Orders</CardTitle>
              <CardDescription>
                Latest purchase orders and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <PurchaseItem 
                  number="PO-2023-001" 
                  collection="Summer Collection" 
                  status="Received" 
                  statusColor="bg-emerald-100 text-emerald-800" 
                />
                
                <PurchaseItem 
                  number="PO-2023-002" 
                  collection="Fall Collection" 
                  status="Ordered" 
                  statusColor="bg-blue-100 text-blue-800" 
                />
                
                <PurchaseItem 
                  number="PO-2023-003" 
                  collection="Winter Collection" 
                  status="Draft" 
                  statusColor="bg-amber-100 text-amber-800" 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}