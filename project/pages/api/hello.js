export default function handler(req, res) {
  res.status(200).json({ 
    message: 'Hello from the API!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: process.env.VERCEL === '1' ? 'true' : 'false'
  });
}
