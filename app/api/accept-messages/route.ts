import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import {User} from "next-auth"

export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session?.user){
        return Response.json(
            {
                success: false,
                message: "Not Authenticated",
            },
            {
                status: 401
            }
        )
    }

    const userId = user._id;
    const {acceptMessage}  = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessage: acceptMessage
            },
            {
                new: true
            }
        )

        if(!updatedUser){
            return Response.json(
                {
                    success: false,
                    message: "Failed to update user status to accept message",
                },
                {
                    status: 401
                }
            )                
        }

        return Response.json(
            {
                success: true,
                message: "Message acceptance status updated successfully",
                updatedUser
            },
            {
                status: 200
            }
        )     

    } catch (error) {
        console.error("Failed to update user status to accept message")
        return Response.json(
            {
                success: false,
                message: "Failed to update user status to accept message",
            },
            {
                status: 500
            }
        )     
    }
 
}

export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session?.user){
        return Response.json(
            {
                success: false,
                message: "Not Authenticated",
            },
            {
                status: 401
            }
        )
    }

    const userId = user._id;
    
    try {
        const foundUser = await UserModel.findById(userId)

        if(!foundUser){
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                {
                    status: 404
                }
            )         
        }

        return Response.json(
            {
                success: true,
                isAcceptingMessages: user.isAcceptingMessages
            },
            {
                status: 200
            }
        )         

    } catch (error) {
        console.error("Error in getting message acceptance status")
        return Response.json(
            {
                success: false,
                message: "Error in getting message acceptance status",
            },
            {
                status: 500
            }
        )         
    }
}