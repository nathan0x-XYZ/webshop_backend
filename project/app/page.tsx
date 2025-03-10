import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-primary-foreground" />
              <h1 className="text-2xl font-bold text-primary-foreground">Fashion Inventory</h1>
            </div>
            <div>
              <Button asChild variant="secondary">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary/20 to-background py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Fashion Retail Inventory Management System</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              A comprehensive solution for managing your fashion retail inventory, from products and suppliers to sales and reporting.
            </p>
            <Button asChild size="lg">
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold mb-8 text-center">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                title="Product Management" 
                description="Manage your products with categories, safety stock levels, and cost tracking."
              />
              <FeatureCard 
                title="Inventory Control" 
                description="Track inventory across multiple warehouses with transfers and auditing."
              />
              <FeatureCard 
                title="Purchase & Sales" 
                description="Manage the complete lifecycle from purchasing to sales with automatic cost updates."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Fashion Inventory Management System
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border">
      <h4 className="text-xl font-semibold mb-3">{title}</h4>
      <p className="text-card-foreground">{description}</p>
    </div>
  );
}