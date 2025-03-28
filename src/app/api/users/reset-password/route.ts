// app/api/users/reset-password/route.ts
import { NextResponse } from "next/server";
import User from "@/app/models/UserModel";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { userId, token, password } = await request.json();
    
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "Invalid user" },
        { status: 400 }
      );
    }

    // Verify token again for security
    const isValid = await bcrypt.compare(token, user.forgotPasswordToken);
    if (!isValid || user.forgotPasswordTokenExpiry < Date.now()) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Update password and clear reset token
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password reset successful"
    });

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}