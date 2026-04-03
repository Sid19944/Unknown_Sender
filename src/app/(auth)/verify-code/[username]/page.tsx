"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

function page() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    mode: "onChange",
    defaultValues : {
      code : ""
    }
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    console.log(data);
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast.success(response.data.message);
      router.replace("/sign-in");
    } catch (error) {
      const axiosErr = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosErr.response?.data.message || "Faild to Verify OTP";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 spcae-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Verify Your Code to Join anoymous adventure</p>
        </div>

        <div>
          <form id="verify-code" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="code"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="code">Verification code</FieldLabel>
                    <div className="flex gap-2">
                      <Input
                        {...field}
                        id="code"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter verification code"
                        autoComplete="off"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </div>
                    {
                      fieldState.invalid && (
                        <FieldError errors={[fieldState.error]}
                        />
                      )
                    }
                  </Field>
                )}
              />
              <Button type="submit">Submit</Button>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  );
}

export default page;
