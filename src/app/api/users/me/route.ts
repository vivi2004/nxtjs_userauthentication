 import { getDataFromToken } from "@/app/helper/getDataFromToken";

import { NextRequest, NextResponse } from "next/server";

import User from "@/app/models/UserModel";
import {connect} from "@/dbconfig/dbConfig"
import { NextRequestHint } from "next/dist/server/web/adapter";

connect();

export async  function GET(request:NextRequest) {
    try {
        
    const userID = await getDataFromToken(request)
     const user = await  User.findOne({_id:userID}).select("-password");
    return NextResponse.json(
        { message:"User found" ,
            data: user
        }

     , {status: 200})
    } catch (error:any) {
         return   NextResponse.json({error:error.message} ,
            {status: 400}

         )
        
    }
}

