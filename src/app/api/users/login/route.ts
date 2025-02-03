import { connect } from "@/dbconfig/dbConfig";
import User from "@/app/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { error, log } from "console";
import  jwt from "jsonwebtoken";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { email, password } = reqBody
        console.log( "Request Body ",reqBody); 
         if(!email || !password) {
            return NextResponse.json({
                error: "Email and password are required"
            } , {status: 400 })
         }

        //  check if the user is existed.
        const user = await User.findOne({ email})
        console.log("It is the error" , user);
        
        if (!user) {
         
            return NextResponse.json({ error: "User doest not exist" }, { status: 400 })
        }


        // check if  password is correct..
        const validPassword = await bcryptjs.compare(password, user.password)
        if (!validPassword) {
            return  NextResponse.json(
        { error: "Invalid Password" },

         { status: 400 })
        }
   // create a token data..
   const tokenData =  { 

     id:user._id ,
     username:user.username,
     email:user.email  

   }

    // create a token..
     const token  = await jwt.sign(tokenData , process.env.TOKEN_SECRET! , {expiresIn:"1d"}) 

     const response = NextResponse.json({
        message: "Login successful" , 
        success:true , 

     })  
     //   response to the cookies.. to send ..

     response.cookies.set("token" ,token , {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        maxAge: 60 * 60 * 24,  
     }) 

      return response;

      
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

