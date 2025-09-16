// app/api/verify-code/route.ts
import  {auth}  from "@/app/api/auth/[...nextauth]/route"; // Adjust the path as needed
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import UserModel from "@/model/user";
import { acceptMessagesSchema } from "@/Schemas/acceptMessages";

export async function POST(request: Request) {
    await dbConnect();
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
  const userId = user._id
  const {acceptingMessages} = await request.json()

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {isAcceptingMessages: acceptingMessages},
        {new: true}
    )
    if(!updatedUser){
        return Response.json(
      {
        success: false,
        message: 'Error Accepting Messages',
      },
      { status: 401 }
    );
    }

    return Response.json(
      {
        success: true,
        message: 'Message acceptance updated successfully',
        updatedUser
      },
      { status: 200 })
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'Error Accepting Messages',
      },
      { status: 500 }
    );
  }
}

export async function GET(request:Request) {
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
  const userId = user._id

 try {
     const foundUser = await UserModel.findById(userId);
   
     if(!foundUser){
       return Response.json(
         {
           success: false,
           message: 'User not Found',
         },
         { status: 404 });
     }
   
     return Response.json(
         {
           success: true,
           isAcceptingMessages : foundUser.isAcceptingMessages
         },
         { status: 200 });
   }
  catch (error) {
    return Response.json(
      {
        success: false,
        message: 'Error Accepting Messages',
      },
      { status: 500 }
    );
  }
}