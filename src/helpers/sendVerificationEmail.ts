import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifiyCode: string,
): Promise<ApiResponse> {
  try {
    // const respo = await resend.emails.send({
    //   from: "onboarding@resend.dev",
    //   to: email,
    //   subject: "Verification Code",
    //   react: VerificationEmail({ username, otp: verifiyCode }),
    // });

    const respo = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.GREV_API_KEY!, // 👈 server side — safe ✅
      },
      body: JSON.stringify({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL,
          name: process.env.BREVO_SENDER_NAME,
        },
        to: [{ email }],
        subject: "Verification Code",
        htmlContent: `
        <div style="font-family: sans-serif; max-width: 400px; margin: auto;">
            <h2>Hello ${username}!</h2>
            <p>Your OTP verification code is:</p>
            <div style="
              font-size: 36px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #4F46E5;
              padding: 16px;
              background: #F3F4F6;
              border-radius: 8px;
              text-align: center;
            ">
              ${verifiyCode}
            </div>
            <p style="color: #6B7280; font-size: 14px;">
              Expires in 10 minutes. Do not share it.
            </p>
          </div>`,
      }),
    });

    if (!respo.ok) {
      return {
        success: false,
        message: "Failed to send verification email",
      };
    }
    return { success: true, message: "Verificaiton Email send successfully" };
  } catch (emailErr) {
    console.log("Error while sending Verification Email", emailErr);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
