// app/api/users/verify-reset-token/route.ts
import { NextResponse } from "next/server";
import User from "@/app/models/UserModel";
import bcrypt from  "bcryptjs"; 


import { connect } from "@/dbconfig/dbConfig";

connect();

export async function POST(request: Request) {
  try {
    const { userId, token } = await request.json();
    
    // Find user by ID

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "Invalid user" },
        { status: 400 }
      );
    }

    // Verify token validity
    const isValidToken = await bcrypt.compare(token, user.forgotPasswordToken!);
    const isExpired = user.forgotPasswordTokenExpiry! < Date.now();

    if (!isValidToken || isExpired) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: "Token is valid"
    });

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
    }
