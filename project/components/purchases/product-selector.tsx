"use client";

import { useState, useEffect } from "react";
import { X, Search, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductSelectorProps {
  onProductsSelected: (products: any[]) => void;
  existingItems?: any[];
}

export function ProductSelector({ onProductsSelected, existingItems = [] }: ProductSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Record<string, any>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const productsData = await response.json();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  useEffect(() => {
    if (existingItems && existingItems.length > 0) {
      const selectedMap: Record<string, any> = {};
      const quantityMap: Record<string, number> = {};
      const priceMap: Record<string, number> = {};
      
      existingItems.forEach(item => {
        selectedMap[item.productId] = {
          id: item.productId,
          sku: item.sku,
          name: item.name,
        };
        quantityMap[item.productId] = item.quantity;
        priceMap[item.productId] = item.unitPrice;
      });
      
      setSelectedProducts(selectedMap);
      setQuantities(quantityMap);
      setPrices(priceMap);
    }
  }, [existingItems]);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleProductSelect = (product: any) => {
    setSelectedProducts(prev => {
      const newSelected = { ...prev };
      
      if (newSelected[product.id]) {
        delete newSelected[product.id];
      } else {
        newSelected[product.id] = {
          id: product.id,
          sku: product.sku,
          name: product.name,
        };
        
        if (!quantities[product.id]) {
          setQuantities(prev => ({
            ...prev,
            [product.id]: 1
          }));
        }
        
        if (!prices[product.id]) {
          setPrices(prev => ({
            ...prev,
            [product.id]: product.costPrice || 0
          }));
        }
      }
      
      return newSelected;
    });
  };

  const handleQuantityChange = (productId: string, value: number) => {
    if (value < 1) value = 1;
    setQuantities(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  const handlePriceChange = (productId: string, value: number) => {
    if (value < 0) value = 0;
    setPrices(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  const handleConfirm = () => {
    const selectedItems = Object.keys(selectedProducts).map(productId => {
      const product = selectedProducts[productId];
      return {
        productId: product.id,
        sku: product.sku,
        productName: product.name,
        quantity: quantities[productId] || 1,
        unitPrice: prices[productId] || 0,
      };
    });
    
    onProductsSelected(selectedItems);
    setIsOpen(false);
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Products
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Select Products</DialogTitle>
            <DialogDescription>
              Search and select products to add to your purchase order
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center space-x-2 my-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, SKU, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <ScrollArea className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No products found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Cost Price</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow 
                        key={product.id}
                        className={selectedProducts[product.id] ? "bg-muted/50" : ""}
                      >
                        <TableCell>
                          <Checkbox
                            checked={!!selectedProducts[product.id]}
                            onCheckedChange={() => handleProductSelect(product)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.sku}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-right">${product.costPrice?.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          {product.stock < product.safetyStock ? (
                            <Badge variant="destructive">{product.stock}</Badge>
                          ) : (
                            product.stock
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </ScrollArea>
            
            {Object.keys(selectedProducts).length > 0 && (
              <div className="border rounded-md p-4 mt-4">
                <h3 className="text-sm font-medium mb-2">Selected Products</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-center">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.keys(selectedProducts).map((productId) => (
                      <TableRow key={productId}>
                        <TableCell>
                          {selectedProducts[productId].sku} - {selectedProducts[productId].name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleQuantityChange(productId, (quantities[productId] || 1) - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={quantities[productId] || 1}
                              onChange={(e) => handleQuantityChange(productId, parseInt(e.target.value) || 1)}
                              className="h-8 w-16 mx-2 text-center"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleQuantityChange(productId, (quantities[productId] || 1) + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <Input
                              type="number"
                              step="0.01"
                              value={prices[productId] || 0}
                              onChange={(e) => handlePriceChange(productId, parseFloat(e.target.value) || 0)}
                              className="h-8 w-24 text-center"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          ${((quantities[productId] || 1) * (prices[productId] || 0)).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleProductSelect(selectedProducts[productId])}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">
                        Total
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${Object.keys(selectedProducts).reduce(
                          (sum, productId) => 
                            sum + (quantities[productId] || 1) * (prices[productId] || 0), 
                          0
                        ).toFixed(2)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={Object.keys(selectedProducts).length === 0}
            >
              Add {Object.keys(selectedProducts).length} Products
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}