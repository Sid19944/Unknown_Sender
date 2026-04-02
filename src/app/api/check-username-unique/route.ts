import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    // localhost:3000/api/check-username-unique?username=sid
    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    // validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return NextResponse.json(
        { success: false, message: usernameError[0] },
        { status: 400 },
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return NextResponse.json(
        { success: false, message: "Username already taken" },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `${result.data.username} available`,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error while checking username", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error Checking username",
      },
      { status: 500 },
    );
  }
}
