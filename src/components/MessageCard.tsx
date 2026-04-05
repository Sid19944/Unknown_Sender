// 'use client'
import React from "react";
import { toast } from "sonner";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { Message } from "@/models/User";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messaageId: string) => void;
};

function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  return (
    <div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="font-semibold text-center text-xl">
              {message?.content}
            </CardTitle>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="cursor-pointer">
                  <X className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your Message from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onMessageDelete(message._id.toString())}
                    className="cursor-pointer"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>

        <CardDescription className="pl-2">
          {new Date(message.createdAt).toLocaleString("en-In")}
        </CardDescription>
      </Card>
    </div>
  );
}

export default MessageCard;
