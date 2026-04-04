"use client";
import React, { useCallback, useEffect, useState } from "react";
import MessageCard from "@/components/MessageCard";
import { Message } from "@/models/User";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { User } from "next-auth";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { Separator } from "@/components/ui/separator";

function page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsWwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    console.log("F",messageId)
    setMessages(
      messages.filter((message) => message._id.toString() !== messageId),
    );
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  // console.log("Form",form)

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessage");

  const fetchAcceptMessage = useCallback(async () => {
    setIsWwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/accept-message`);
      setValue("acceptMessage", response.data.isAcceptingMessages as boolean);
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse>;
      let errorMessage =
        axiosErr.response?.data.message || "Failed to Fetch Error Message";
      toast.error(errorMessage);
    } finally {
      setIsWwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsWwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>(`/api/get-messages`);
        setMessages(response.data.messages || []);

        if (refresh) {
          toast.message("Showing latest messages");
        }
      } catch (err) {
        const axiosErr = err as AxiosError<ApiResponse>;
        let errorMessage =
          axiosErr.response?.data.message || "Failed to Fetch Error Message";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
        setIsWwitchLoading(false);
      }
    },
    [setIsLoading, setMessages],
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  // handle switch change
  const handleSwitchChange = async () => {
    try {
      const respoonse = await axios.post<ApiResponse>(`/api/accept-message`, {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessage", !acceptMessages);
      toast.success(respoonse.data.message);
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse>;
      let errorMessage =
        axiosErr.response?.data.message || "Failed to Fetch Error Message";
      toast.error(errorMessage);
    }
  };

  if (session?.user) {
    var { username } = session?.user as User;
  }

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile URL has been copied successfully");
  };

  return (
    <div className="flex-1 p-6 bg-gray-800 text-white w-full ">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard} className="cursor-pointer">Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessage")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
          className="cursor-pointer"
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4 cursor-pointer text-black"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id.toString()}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default page;
