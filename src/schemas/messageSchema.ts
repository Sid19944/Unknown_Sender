import { email, z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(2, { message: "Content must be at lest 2 character" })
    .max(300, { message: "Content must be no longer then 300 character" }),
});
