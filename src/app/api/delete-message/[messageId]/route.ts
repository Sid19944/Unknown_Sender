import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ messageId: string }> },
) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 },
    );
  }
  const { messageId } = await params;

  try {
    if (!messageId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please Provide Message ID",
        },
        { status: 400 },
      );
    }

    const deleteMessage = await UserModel.findByIdAndUpdate(
      { _id: user._id },
      {
        $pull: { messages: { _id: new mongoose.Types.ObjectId(messageId) } },
      },
    );

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
    return NextResponse.json(
      {
        success: false,
        message: "Error while deleting the message",
      },
      { status: 500 },
    );
  }
}
