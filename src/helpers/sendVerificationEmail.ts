import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifiyCode: string,
): Promise<ApiResponse> {
  try {
    const respo = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verification Code",
      react: VerificationEmail({ username, otp: verifiyCode }),
    });

    if (respo.error) {
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
