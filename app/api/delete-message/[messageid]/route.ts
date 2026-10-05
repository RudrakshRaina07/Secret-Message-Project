import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/User";
import { getServerSession } from "next-auth";
import {User} from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(request: Request, {params}: {params: {messageid: string}}) {
    await dbConnect()
    const messageId = params.messageid

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

    try {
        const updatedResult = await UserModel.updateOne(
            {_id: user._id},
            {
                $pull: {message: {_id: messageId}}
            }
        )

        if(updatedResult.modifiedCount === 0){
            return Response.json(
                {
                    success: false,
                    message: "Message not found or message is already deleted",
                },
                {
                    status: 404
                }
            )         
        }

            
        return Response.json(
            {
                success: true,
                message: "Message deleted successfully",
            },
            {
                status: 200
            }
        )         

    } catch (error) {
        console.error("Error in message route: ", error)
        return Response.json(
            {
                success: false,
                message: "Error deleting message",
            },
            {
                status: 500
            }
        )         
    }

}