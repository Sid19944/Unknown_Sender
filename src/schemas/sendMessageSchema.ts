import { z } from "zod";

export const messageValidation = z
  .string()
  .min(10, "Message must be atlest 10 charachter")
  .max(100, "Messase can't be more then 100 charcter");

export const sendMessageSchema = z.object({
  message: messageValidation,
});
