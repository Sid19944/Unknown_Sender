import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest } from "next/server";

import { singUpSchema } from "@/schemas/singUpSchema";
import z from "zod";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const { username, email, password } = body;
    if (!username || !email || !password) {
      return Response.json(
        {
          success: false,
          messaage: "Please Provide all details",
        },
        { status: 400 },
      );
    }


    // Zod schema validation
    const checkSignUpSchema = singUpSchema.safeParse(body);
    if (!checkSignUpSchema.success) {
      const formatted = checkSignUpSchema.error.format();

      const usernameErr = formatted.username?._errors?.[0];
      const emailErr = formatted.email?._errors?.[0];
      const passwordErr = formatted.password?._errors?.[0];

      return Response.json(
        {
          success: false,
          message: `${usernameErr ?? emailErr ?? passwordErr ?? "Invalid Input "}`,
        },
        { status: 400 },
      );
    }

    const userExistByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (userExistByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exist",
        },
        { status: 400 },
      );
    }

    const userExistByEmail = await UserModel.findOne({
      email,
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (userExistByEmail) {
      if (userExistByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exist with email",
          },
          { status: 500 },
        );
      } else {
        const hashPass = await bcrypt.hash(password, 10);
        userExistByEmail.password = hashPass;
        userExistByEmail.verifyCode = verifyCode;
        userExistByEmail.verifyCodeExpiry = new Date(
          Date.now() + 60 * 60 * 1000,
        );
        await userExistByEmail.save();
      }
    } else {
      const hashPass = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const user = await UserModel.create({
        username,
        email,
        password: hashPass,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
    }

    // send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
    );

    console.log(emailResponse);
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "User Registered Successfully, Please verify your Email",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error registring user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      },
    );
  }
}
