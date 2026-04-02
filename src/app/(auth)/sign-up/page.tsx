"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";

function page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const debouncedUsername = useDebounce(username, 1000);

  // zob implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // checking the username unique
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage("");

        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${debouncedUsername}`,
          );
          if (!response.data.success) {
            toast.error(response.data.message);
          } else {
            toast.success(response.data.message);
          }
          setUsernameMessage(response.data.message);
        } catch (err) {
          console.log("Error while checking the username unique", err);
          const axiosErr = err as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosErr.response?.data.message ?? "Error checking username",
          );
        } finally {
          const timer = setTimeout(() => {
            setIsCheckingUsername(false);
          }, 500);

          return () => clearTimeout(timer);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);

      toast.success(response.data.message);
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);

      form.reset({
        username: "",
        email: "",
      });
    } catch (err) {
      console.error("Error in sign-up of user");
      const AxiosErr = err as AxiosError<ApiResponse>;
      let errorMessage = AxiosErr.response?.data.message;
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 spcae-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystry Message
          </h1>
          <p className="mb-4">Sign up to start your anoymous adventure</p>
        </div>

        <div>
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <div className="flex gap-2">
                      <Input
                        {...field}
                        id="username"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter username"
                        autoComplete="off"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setUsername(e.target.value);
                        }}
                      />
                      {isCheckingUsername && (
                        <Loader className="animate-spin" />
                      )}
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter email id"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter password"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin" /> Loading...
                  </>
                ) : (
                  <>SignUp</>
                )}
              </Button>
            </FieldGroup>
          </form>
          <div>
            <p>
              Already a member?{" "}
              <Link
                href={"/sign-in"}
                className="text-blue-400 hover:text-blue-600 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
