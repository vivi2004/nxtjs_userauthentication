import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/UserModel";
import { connect } from "@/dbconfig/dbConfig";

connect();

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 400 }
            );
        }

        // Reset token logic here

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
    } // Added missing closing brace
} // Properly closed function