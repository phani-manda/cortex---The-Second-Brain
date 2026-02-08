/**
 * POST /api/auth/register – Create a new user account
 */

import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";
import { checkDatabaseConnection } from "@/lib/db";

export async function POST(request: NextRequest) {
  // Check database configuration first
  if (!checkDatabaseConnection()) {
    console.error("❌ Registration failed: DATABASE_URL not configured");
    return NextResponse.json(
      { 
        error: "Database not configured",
        details: "Please set DATABASE_URL in your .env.local file. See .env.example for reference."
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const user = await registerUser(email, password, name);

    return NextResponse.json(
      { 
        message: "Account created successfully",
        user: { id: user.id, email: user.email, name: user.name }
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    
    if (message === "User already exists") {
      return NextResponse.json({ error: message }, { status: 409 });
    }
    
    if (message.includes("Database not configured")) {
      console.error("❌ Registration failed:", message);
      return NextResponse.json(
        { 
          error: "Database not configured",
          details: "Please set DATABASE_URL in your .env.local file."
        },
        { status: 503 }
      );
    }
    
    console.error("❌ Registration error:", message);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
