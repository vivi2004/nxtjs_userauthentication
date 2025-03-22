import { connect } from "@/dbconfig/dbConfig";
import User from "@/app/models/UserModel.js";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/app/helper/mailer";
// import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    // Ensure the database is connected before proceeding.
    await connect();

    // Parse the incoming JSON body.
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    // Basic input validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields: username, email, or password." },
        { status: 400 }
      );
    }

    console.log("Request body:", reqBody);

    // Check if a user with the provided email already exists.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password.
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create a new user instance.
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database.
    const savedUser = await newUser.save();
    console.log("Saved user:", savedUser);
      // Send verification email..
       await sendEmail({email, emailType: "VERIFY" , 
         userId: savedUser._id })
      

    // (Optional) Send verification email.
    // await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

    // Return a successful response. 
    
    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

