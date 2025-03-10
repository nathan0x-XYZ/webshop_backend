"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Download } from "lucide-react";
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

const categoryData = [
  { name: "Shirts", value: 400 },
  { name: "Pants", value: 300 },
  { name: "Dresses", value: 200 },
  { name: "Accessories", value: 100 },
  { name: "Shoes", value: 150 },
];

const warehouseData = [
  { name: "Main Store", shirts: 200, pants: 150, dresses: 100 },
  { name: "Downtown Branch", shirts: 150, pants: 100, dresses: 75 },
  { name: "Mall Outlet", shirts: 50, pants: 50, dresses: 25 },
];

function ChartSkeleton() {
  return (
    <div className="w-full space-y-2">
      <Skeleton className="h-[350px] w-full rounded-md" />
    </div>
  );
}

export default function ReportsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("sales");

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <Tabs 
        defaultValue="sales" 
        className="space-y-4"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="profit">Profit & Loss</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
                <CardDescription>
                  Monthly sales performance for the current year
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                {isLoading ? (
                  <ChartSkeleton />
                ) : (
                  activeTab === "sales" && <DynamicCharts type="line" data={salesData} />
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>
                  Distribution of sales across product categories
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                {isLoading ? (
                  <ChartSkeleton />
                ) : (
                  activeTab === "sales" && <DynamicCharts type="pie" data={categoryData} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Inventory by Warehouse</CardTitle>
                <CardDescription>
                  Current inventory levels across warehouses
                </CardDescription>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="shirts">Shirts</SelectItem>
                  <SelectItem value="pants">Pants</SelectItem>
                  <SelectItem value="dresses">Dresses</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="pl-2">
              {isLoading ? (
                <ChartSkeleton />
              ) : (
                activeTab === "inventory" && <DynamicCharts type="bar" data={warehouseData} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="purchases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders by Supplier</CardTitle>
              <CardDescription>
                Total purchase amounts by supplier
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              {isLoading ? (
                <ChartSkeleton />
              ) : (
                activeTab === "purchases" && (
                  <DynamicCharts 
                    type="bar" 
                    data={[
                      { name: "Fashion Wholesale Co.", value: 12500 },
                      { name: "Textile Suppliers Inc.", value: 8750 },
                      { name: "Apparel Manufacturing Ltd.", value: 15200 },
                      { name: "Fabric Importers Co.", value: 6800 },
                      { name: "Accessory Distributors", value: 4500 },
                    ]}
                  />
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss Statement</CardTitle>
              <CardDescription>
                Monthly revenue, cost, and profit
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              {isLoading ? (
                <ChartSkeleton />
              ) : (
                activeTab === "profit" && (
                  <DynamicCharts 
                    type="line" 
                    data={[
                      { name: "Jan", total: 2000 },
                      { name: "Feb", total: 3000 },
                      { name: "Mar", total: 3600 },
                      { name: "Apr", total: 4200 },
                      { name: "May", total: 4800 },
                      { name: "Jun", total: 5600 },
                    ]}
                  />
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}