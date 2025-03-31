import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/UserModel";
import { connect } from "@/dbconfig/dbConfig";
import crypto from "crypto";
import { sendEmail } from "@/app/helper/mailer"; // Ensure you have this helper

connect();

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        // Validation
        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        // Save token to database
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = resetTokenExpiry;
        await user.save();

        // Send email
        const emailResponse = await sendEmail({
            email: user.email,
            emailType: "RESET",
            userId: user._id
        });

        if (!emailResponse) {
            return NextResponse.json(
                { error: "Failed to send reset email" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "Password reset email sent",
            success: true
        });

    } catch (error: unknown) {
        let errorMessage = "Server error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}


