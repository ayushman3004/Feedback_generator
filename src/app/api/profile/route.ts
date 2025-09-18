import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import { getSession } from "next-auth/react";
import { success } from "zod";
import { User } from "next-auth";

export async function POST(request:Request){
    await dbConnect()
    const {email,password,username} = await request.json()
    const session = await getSession()
     const user :User = session?.user
    if(!session  || !session.user){
        return Response.json({
            success: false,
            message: "Please Login first"
        })
    }
    try {
        const findUser = await UserModel.findById({id : user._id})
        if(!findUser){
            return Response.json({
            success: false,
            message: "No user Found"
        })
        return Response.json(findUser)
        }
    } catch (error) {
        return Response.json({
            success: false,
            message: error
        })
    }
    
    
}