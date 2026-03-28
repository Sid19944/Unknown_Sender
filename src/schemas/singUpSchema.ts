import { email, z } from "zod";

export const usernameValidation = z
  .string()
  .min(4, "Username must be atlest 4 charcters")
  .max(19, "Username must to no more then 20 charater")
  .regex(
    /^[a-zA-Z0-9]+$/,
    "Username can't contain space and special character",
  );

export const singUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid Email Address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
