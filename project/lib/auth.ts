import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Function to sign JWT
export async function signJWT(payload: AuthUser) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-here");
    
    const token = await new SignJWT({ payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_EXPIRES_IN || '7d')
      .sign(secret);
    
    return token;
  } catch (error) {
    console.error("Error signing JWT:", error);
    throw error;
  }
}

// Function to verify JWT
export async function verifyJWT(token: string): Promise<AuthUser | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-here");
    const { payload } = await jwtVerify(token, secret);
    
    return payload.payload as AuthUser;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return null;
  }
}

// Function to get current user from cookies
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) return null;
    
    return verifyJWT(token);
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Middleware to check authentication
export async function authMiddleware(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const user = await verifyJWT(token);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return user;
  } catch (error) {
    console.error("Auth middleware error:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Check if user has required role
export function hasRequiredRole(user: AuthUser, requiredRoles: UserRole[]) {
  return requiredRoles.includes(user.role);
}

// Role-based middleware
export async function roleMiddleware(
  req: NextRequest,
  allowedRoles: UserRole[]
) {
  const user = await authMiddleware(req);
  
  if (user instanceof NextResponse) {
    return user;
  }
  
  if (!hasRequiredRole(user, allowedRoles)) {
    return NextResponse.json(
      { error: 'Forbidden: Insufficient permissions' },
      { status: 403 }
    );
  }
  
  return user;
}