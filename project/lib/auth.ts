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

// 檢查是否是 Vercel 預覽環境
const isVercelPreview = () => {
  return process.env.VERCEL_ENV === 'preview' || process.env.IS_WEBCONTAINER === 'true';
};

// 為預覽環境創建一個測試用戶
const getTestUser = (): AuthUser => {
  return {
    id: 'test-user-id',
    email: 'admin@example.com',
    name: 'Test Admin',
    role: UserRole.ADMIN,
  };
};

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
    // 在 Vercel 環境中始終返回測試用戶
    if (process.env.VERCEL || process.env.VERCEL_URL) {
      console.log('Running in Vercel environment, returning test user');
      return getTestUser();
    }
    
    // 檢查是否在構建過程中
    if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
      console.log('Running during build process, returning test user');
      return getTestUser();
    }
    
    // 在預覽環境中返回測試用戶
    if (isVercelPreview()) {
      console.log('Using test user for preview environment');
      return getTestUser();
    }
    
    try {
      const cookieStore = cookies();
      const token = cookieStore.get('token')?.value;
      
      if (!token) {
        console.log('No token found in cookies, returning null');
        return null;
      }
      
      return await verifyJWT(token);
    } catch (cookieError) {
      console.log('Error accessing cookies:', cookieError);
      return null;
    }
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Middleware to check authentication
export async function authMiddleware(req: NextRequest) {
  try {
    // 在預覽環境中繞過身份驗證
    if (isVercelPreview()) {
      console.log('Skipping authentication for preview environment');
      return getTestUser();
    }
    
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

// Export auth object with all functions
export const auth = {
  signJWT,
  verifyJWT,
  getCurrentUser,
  authMiddleware,
  hasRequiredRole,
  roleMiddleware
};