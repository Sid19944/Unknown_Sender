import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  await dbConnect();

  try {
    const { username, messageId } = await req.json();

    if (!messageId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please Provide Message ID",
        },
        { status: 400 },
      );
    }

    const deleteMessage = await UserModel.findOneAndUpdate(
      { username },
      {
        $pull: { messages: { _id: messageId } },
      },
    );
    console.log(deleteMessage);

    if (!deleteMessage) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Message ID",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message Deleted Successfully",
      },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        success: false,
        message: "Error while deleting the message",
      },
      { status: 500 },
    );
  }
}
