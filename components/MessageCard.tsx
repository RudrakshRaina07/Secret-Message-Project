'use client'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
} from "@/components/ui/alert-dialog"

import { Button } from './ui/button';
import { X } from "lucide-react";
import { toast } from "@/components/ui/toast"
import axios from "axios";
import { ApiResponse } from "@/app/types/ApiResponse";
import { Message } from "@/app/models/User";

type MessageCardProps = {
    message: Message,
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({message, onMessageDelete}: MessageCardProps) => {

    const messageDate =
        message.createdAt instanceof Date
            ? message.createdAt.toLocaleString()
            : new Date(message.createdAt).toLocaleString();

    const handleDeleteConfirm = async () => {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)

        toast.add({
            title: response.data.message 
        })

        onMessageDelete(String(message._id))
    }

    return (
        <Card>
            <CardHeader>
                <AlertDialog>
                <AlertDialogTrigger render={<Button variant="destructive"><X className="w-5 h-5"/></Button>} />
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteConfirm}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
                <CardDescription
                    className="text-lg font-medium text-black whitespace-pre-wrap wrap-break-word leading-6"
                >{message.content}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-gray-500">{messageDate}</p>
            </CardContent>
        </Card>

    )
}

export default MessageCard
