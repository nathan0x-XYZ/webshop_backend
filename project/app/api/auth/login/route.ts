import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { signJWT } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Login request body:", body);
    
    // Validate request body
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      console.error("Invalid input:", result.error.format());
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { email, password } = result.data;
    
    console.log(`Login attempt for email: ${email}`);
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      console.log(`User not found: ${email}`);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    
    console.log("User found:", { id: user.id, email: user.email });
    
    // Simplified password verification for WebContainer
    // In a real app, use bcrypt.compare(password, user.hashedPassword)
    const isPasswordValid = password === "password123";
    console.log("Password validation result:", isPasswordValid);
    
    if (!isPasswordValid) {
      console.log(`Invalid password for user: ${email}`);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    
    console.log(`User authenticated successfully: ${email}, role: ${user.role}`);
    
    try {
      // Create JWT token
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
      
      const token = await signJWT(userData);
      console.log("JWT token created successfully");
      
      // Return token in response instead of setting a cookie
      return NextResponse.json({
        token,
        user: userData
      });
    } catch (tokenError) {
      console.error("Token generation error:", tokenError);
      return NextResponse.json(
        { error: "Authentication error", details: tokenError instanceof Error ? tokenError.message : "Unknown token error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Add dynamic export to fix the error
export const dynamic = 'force-dynamic';