import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Hello World!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: process.env.VERCEL === '1' ? 'true' : 'false',
  });
}
