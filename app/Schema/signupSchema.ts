import {z} from "zod"

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 characters")
    .max(20, "Username should not be more than 20 characters")
    .regex(/^[a-zA-Z0-9_]{2,20}$/, "Username should not contain special characters")


export const signupSchema = z.object({
    username: usernameValidation,
    email: z.email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must contain at least 6 characters"}),
})