import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white',
      padding: '2rem'
    }}>
      <header style={{
        backgroundColor: '#1F2937',
        padding: '1rem',
        marginBottom: '2rem',
        borderRadius: '0.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Fashion Inventory</span>
        </div>
        <Link href="/login" style={{
          backgroundColor: '#374151',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          color: 'white',
          textDecoration: 'none'
        }}>
          Login
        </Link>
      </header>

      <main>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Fashion Retail Inventory Management System
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#9CA3AF',
            maxWidth: '48rem',
            margin: '0 auto'
          }}>
            A comprehensive solution for managing your fashion retail inventory,
            from products and suppliers to sales and reporting.
          </p>
          <Link href="/login" style={{
            display: 'inline-block',
            marginTop: '2rem',
            backgroundColor: '#2563EB',
            color: 'white',
            fontWeight: 'bold',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none'
          }}>
            Get Started
          </Link>
        </div>

        <div style={{ marginTop: '5rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            Key Features
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{ 
              backgroundColor: '#1F2937', 
              padding: '1.5rem',
              borderRadius: '0.5rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'semibold', marginBottom: '1rem' }}>
                Product Management
              </h3>
              <p style={{ color: '#9CA3AF' }}>
                Manage your products with categories, safety stock levels, and cost tracking.
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: '#1F2937', 
              padding: '1.5rem',
              borderRadius: '0.5rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'semibold', marginBottom: '1rem' }}>
                Inventory Control
              </h3>
              <p style={{ color: '#9CA3AF' }}>
                Track inventory across multiple warehouses with transfers and auditing.
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: '#1F2937', 
              padding: '1.5rem',
              borderRadius: '0.5rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'semibold', marginBottom: '1rem' }}>
                Purchase & Sales
              </h3>
              <p style={{ color: '#9CA3AF' }}>
                Manage the complete lifecycle from purchasing to sales with automatic cost updates.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}