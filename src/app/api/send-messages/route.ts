import { Message } from "@/model/user";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    //isAccepting Messages

    if(!user.isAcceptingMessages){
        return NextResponse.json({
          success: false,
          message: "User not found",
        },
        { status: 403 })
    }

    const newMessage = {content,createdAt : new Date()}
    user.messages.push(newMessage as Message)
    await user.save()
    return NextResponse.json({
          success: true,
          message: "Message sent Successfully",
        },
        { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'something went wrong',
      },
      { status: 500 }
    )
  }
}
