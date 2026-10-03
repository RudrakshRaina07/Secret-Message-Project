import { Message } from "@/app/models/User"
import { undefined } from "zod";
export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    messages?: Array<Message>;
}