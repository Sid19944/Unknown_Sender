"use client";
import { Button } from "@/components/ui/button";
import { sendMessageSchema } from "@/schemas/sendMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { useParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import { Separator } from "@/components/ui/separator";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import Footer from "@/components/Footer";
import SendIcon from "@mui/icons-material/Send";

function route() {
  const params = useParams<{ username: string }>();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";
  const [suggestedMessages, setSuggestedMessages] =
    useState(initialMessageString);

  const form = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: zodResolver(sendMessageSchema),
    mode: "onChange",
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof sendMessageSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(
        `/api/send-message/${params.username}`,
        {
          content: data.message,
        },
      );
      toast.success(response?.data.message);
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse>;
      const errMessage =
        axiosErr.response?.data.message ?? "Error while sending message";
      toast.error(errMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestMessages = async () => {
    setIsThinking(true);
    try {
      const response = await axios.post(`/api/suggest-message`);
      setSuggestedMessages(response.data);
    } catch (error) {
      const axiosErr = error as AxiosError<ApiResponse>;
      const errMessage =
        axiosErr.response?.data.message || "AI Failed Generate Questions";
      toast.error(errMessage);
    } finally {
      setIsThinking(false);
    }
  };

  const Questions: string[] = suggestedMessages.split("||");
  const message = form.watch("message");

  const selectMessage = (qus: string) => {
    form.setValue("message", qus, { shouldValidate: true });
  };

  return (
    <div className="flex justify-center items-center flex-col h-screen">
      <nav className="w-full flex shadow-md justify-around p-2">
        <h1 className="text-xl font-semibold">True Message's</h1>
        <div className="gap-2 flex">
          <Link href="/">
            <Button className="cursor-pointer">Home</Button>
          </Link>
          {session?.user ? (
            <Link href="/dashboard">
              <Button className="cursor-pointer">Dashboard</Button>
            </Link>
          ) : (
            <></>
          )}
        </div>
      </nav>

      <div className="font-mono w-[90%] lg:w-[70%]">
        <h1 className="py-10 text-4xl text-center font-bold">
          Public Profile Link
        </h1>
        <form
          id="message-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="mb-2"
        >
          <FieldGroup className="flex justify-center items-center">
            <Controller
              name="message"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-send-to">
                    Send Anonymous Message to @{session?.user.username}
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="form-send-to"
                      placeholder="Write your anonymous message here"
                      rows={3}
                      maxLength={100}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/100 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <InputGroupButton
              disabled={isSubmitting || message.length < 10}
              variant="default"
              size="sm"
              className="cursor-pointer"
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Please Wait...
                </>
              ) : (
                <>
                  <SendIcon />
                  Send It
                </>
              )}
            </InputGroupButton>
          </FieldGroup>
        </form>

        <Separator className="mb-2" />

        <div className="">
          <Button
            disabled={isThinking}
            onClick={suggestMessages}
            className="cursor-pointer mb-2"
          >
            {isThinking ? (
              <>
                <Loader2 className="animate-spin" /> Thinking...
              </>
            ) : (
              <>
                <AutoFixHighIcon /> Suggest Messages
              </>
            )}
          </Button>
          <div className="flex justify-center border rounded-lg">
            <div className=" p-1 rounded-lg w-full flex flex-col gap-5 justify-center items-center py-5">
              <div className="w-[95%]">
                <h1 className="text-xl font-semibold">Messages</h1>
                <p className="text-start text-sm">
                  Click on any message below to select it.
                </p>
              </div>
              {Questions.map((qus: string, idx) => (
                <div
                  key={idx}
                  onClick={() => selectMessage(qus)}
                  className="cursor-pointer active:bg-gray-100 border rounded-lg p-2 text-center w-[95%] tracking-tight text-sm"
                >
                  {qus}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-auto w-full">
        <Footer />
      </div>
    </div>
  );
}

export default route;
