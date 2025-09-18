import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
// import mongoose from "mongoose";
import { auth } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import mongoose, { ObjectId } from "mongoose";

export async function GET() {
  try {
    await dbConnect();

    const session = await auth();
    if (!session || !session.user?._id) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    const userId = new mongoose.Types.ObjectId(session.user._id);
    const user = await UserModel.aggregate([
  { $match: { _id: userId } },
  { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
  { $sort: { "messages.createdAt": -1 } },
  { $group: { _id: "$_id", messages: { $push: "$messages" } } },
]);


    if (!user || user.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, messages: user[0].messages.filter(Boolean) },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/get-messages error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
