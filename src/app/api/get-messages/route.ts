import  {auth}  from "@/app/api/auth/[...nextauth]/route"; // Adjust the path as needed
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import UserModel from "@/model/user";
import { acceptMessagesSchema } from "@/Schemas/acceptMessages";
import mongoose from "mongoose";


export async function POST(request: Request) {
    await dbConnect()
  const session = await auth();
  const user :User = session?.user

  if(!session || !session.user){
    return Response.json(
      {
        success: false,
        message: 'User not authenticated',
      },
      { status: 401 }
    );
  }
  const userId = new mongoose.Types.ObjectId(user._id?.toString())
  try {
    const user = await UserModel.aggregate([
        {$match : {_id : userId}},
        {$unwind: '$messages'},
        {$sort : {'messages.createdAt' : -1}},
        {$group: {_id : '$_id', messages : {$push : '$messages'} }}
    ])

    if(!user || user.length === 0){
        return Response.json(
      {
        success: false,
        message: 'User not found',
      },
      { status: 404 }
    );
    }
    return Response.json(
      {
        success: true,
        messages: user[0].messages
      },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'something went wrong',
      },
      { status: 500 }
    )
  }

}