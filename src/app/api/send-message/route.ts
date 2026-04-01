import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  const body = await req.json();
  const { username, content } = body;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    // is user accepting the messages
    if (!user.isAcceptingMessage) {
      return NextResponse.json(
        {
          success: false,
          message: "User not accepting the messages",
        },
        { status: 403 },
      );
    }

    const newMessage = {
      content,
      createdAt: new Date(),
    };

    user.messages.push(newMessage as Message)

    await user.save()

    return NextResponse.json(
        {
          success: true,
          message: "Message send successfully",
        },
        { status: 200 },
      );

  } catch (error) {
    console.log("error while send-message",error)
    return NextResponse.json(
        {
          success: true,
          message: "Failed to send message",
        },
        { status: 500 },
      );
  }
}
