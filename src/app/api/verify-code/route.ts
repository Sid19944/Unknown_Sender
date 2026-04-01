import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { username, code } = body;

    const decodedusername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedusername });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User Not Found" },
        { status: 400 },
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpiry = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpiry) {
      user.isVerified = true;
      await user.save();

      return NextResponse.json(
        { success: true, message: "Account Verified Successfully" },
        { status: 200 },
      );
    } else if (!isCodeValid) {
      return NextResponse.json(
        { success: false, message: "Invalid Verification code" },
        { status: 400 },
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Verification code has expired, please sign-up again",
        },
        { status: 400 },
      );
    }
  } catch (err) {
    console.error("Error while Verifying user", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error Verifying user",
      },
      { status: 500 },
    );
  }
}
