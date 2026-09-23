import dbConnect from "@/app/lib/dbConnect"
import UserModel from "@/app/models/User"
import bcrypt, { hash } from "bcrypt"

import {sendVerificationEmail} from "@/app/helpers/sendVerificationEmail"
import { success } from "zod";
import { messageSchema } from "@/app/Schema/messageSchema";

export async function POST(request: Request) {
    await dbConnect()
    try {
        const {username, email, password} = await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username, 
            isVerified: true,
        })

        if(existingUserVerifiedByUsername){
            return Response.json(
                {
                    success: false,
                    message: "User already exist"
                },
                {
                    status: 400
                }
            )
        }

        const existingUserVerifiedByEmail = await UserModel.findOne({email})

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserVerifiedByEmail){
            if(existingUserVerifiedByEmail.isVerified){
                return Response.json(
                    {
                        success: false,
                        message: "User with this email already exist"
                    },
                    {
                        status: 400
                    }
                )
            }else{
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserVerifiedByEmail.password = hashedPassword
                existingUserVerifiedByEmail.verifyCode = verifyCode
                existingUserVerifiedByEmail.verifyExpiryCode = new Date(Date.now() + 3600000)
                
                await existingUserVerifiedByEmail.save()
            }
        }else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyExpiryCode: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                message: [],
            })

            await newUser.save()
        }

        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if(!emailResponse.success){
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                {
                    status: 400
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "User registered successfully. Please verify your email."
            },
            {
                status: 201
            }
        )

    } catch (error) {
        console.error("Error registering user: ", error)
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
}