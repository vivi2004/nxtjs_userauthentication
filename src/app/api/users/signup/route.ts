// src/app/api/users/signup/route.ts
import { connect } from "@/dbconfig/dbConfig";
import User from "@/app/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect();

// Define the shape of the incoming JSON
interface SignupRequestBody {
  username: string;
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    // cast the JSON to our interface so no more `any`
    const { username, email, password } = (await request.json()) as SignupRequestBody;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser, // ideally you’d strip out sensitive fields here
    });

  } catch (err: unknown) {
    let errorMessage = "Server error";
    if (err instanceof Error) errorMessage = err.message;
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
