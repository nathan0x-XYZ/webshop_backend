export default function Home() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ color: '#0070f3' }}>Fashion Inventory System</h1>
      <p>Welcome to the Fashion Inventory System. This is a simple test page.</p>
      <div style={{ marginTop: '20px' }}>
        <a 
          href="/login" 
          style={{ 
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
          Login
        </a>
      </div>
    </div>
  );
}