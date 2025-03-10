"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function NewTransferPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 這裡將實現表單提交邏輯
      toast.success("轉移單創建成功！");
      router.push("/transfers");
    } catch (error) {
      console.error(error);
      toast.error("創建轉移單時出錯");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">創建新轉移單</h1>
        <Button variant="outline" onClick={() => router.back()}>返回</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>轉移單信息</CardTitle>
          <CardDescription>創建新的庫存轉移單</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="sourceWarehouse">來源倉庫</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇來源倉庫" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warehouse1">主倉庫</SelectItem>
                    <SelectItem value="warehouse2">零售倉庫</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="destinationWarehouse">目標倉庫</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇目標倉庫" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warehouse1">主倉庫</SelectItem>
                    <SelectItem value="warehouse2">零售倉庫</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="grid gap-3">
                <Label htmlFor="notes">備註</Label>
                <Input id="notes" placeholder="輸入備註信息（可選）" />
              </div>
            </div>
            
            <div className="mt-6">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "處理中..." : "創建轉移單"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}