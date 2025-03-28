// app/api/users/forgot-password/route.ts
import { NextResponse } from "next/server";
import User from "@/app/models/UserModel";
import { sendEmail } from "@/app/helper/mailer";
import { connect} from "@/dbconfig/dbConfig";

connect();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Generate and send reset token
    await sendEmail({
      email,
      emailType: "RESET",
      userId: user._id.toString()
    });

    return NextResponse.json({
      success: true,
      message: "Password reset email sent successfully"
    });

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}