# Fashion Retail Inventory Management System

A comprehensive inventory management system for fashion retail businesses, built with Next.js, Prisma, PostgreSQL, and TypeScript.

## Features

1. **User Management**
   - Four role levels: ROOT, ADMIN, MANAGER, STAFF
   - Role-based access control
   - JWT authentication

2. **Product Management**
   - Product categories
   - Safety stock levels
   - Cost tracking

3. **Supplier Management**
   - Supplier details and contacts
   - Purchase order history

4. **Warehouse Management**
   - Multiple warehouse support
   - Inventory tracking by location

5. **Purchase Management**
   - Create purchase orders
   - Receive inventory
   - Automatic cost price updates (weighted average)

6. **Inventory Transfer**
   - Move inventory between warehouses
   - Transfer tracking

7. **Sales Management**
   - Create sales orders
   - Automatic inventory reduction
   - Stock availability checks

8. **Inventory Audit**
   - Record physical counts
   - Track discrepancies
   - Adjust system quantities

9. **Reporting**
   - Sales reports
   - Inventory reports
   - Purchase reports
   - Profit & loss analysis

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the database connection string

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Seed the database:
   ```bash
   npm run seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

### Default Users

After seeding, the following users are available:

- **Root Admin**: admin@example.com / password123
- **Admin**: admin2@example.com / password123
- **Manager**: manager@example.com / password123
- **Staff**: staff@example.com / password123

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions and shared code
- `/prisma` - Prisma schema and migrations
- `/scripts` - Utility scripts (e.g., database seeding)

## Business Flow

1. Create product data (initially without cost price)
2. Create supplier data
3. Create warehouse data
4. Create purchase orders (select products, quantities, unit prices)
5. Receive purchase orders (updates product cost prices using weighted average)
6. Transfer inventory between warehouses
7. Perform inventory audits to reconcile physical and system quantities
8. Create sales orders (checks inventory and reduces stock)

## License

This project is licensed under the MIT License.