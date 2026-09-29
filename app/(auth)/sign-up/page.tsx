'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react";
import { Controller,useForm } from "react-hook-form"
import * as z from "zod"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/navigation";
import { signupSchema } from "@/app/Schema/signupSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/app/types/ApiResponse";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link"

const page = () => {
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsernmae, setIsCheckingUsernmae] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setUsername, 300)
  const router = useRouter()

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if(username){
        setUsernameMessage('')
        setIsCheckingUsernmae(true)

        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          let message = response.data.message
          setUsernameMessage(message)

        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          )
        } finally{
          setIsCheckingUsernmae(false)
        }
      }
    }

    checkUsernameUnique()

  }, [username])

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true)

    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)

      toast.add({
        type:"success",
        title: "Success",
        description: response.data.message
      })

      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error in signup of user: ", error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message
      toast.add({
        type: "Signup failed",
        description: errorMessage,
      })
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="flex justify-center items-center bg-gray-400 min-h-screen">
      <div className="w-max max-w-md p-8 space-y-8 shadow-md bg-white rounded-xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Mystery Message</h1>
          <p className="mb-4f">Sign up to start your anonymous adventure</p>
        </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field >
                    <FieldLabel htmlFor="form-rhf-demo-title">
                      Username
                    </FieldLabel>
                    <input
                      {...field}
                      id="username"
                      placeholder="username"
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    /> 
                    {isCheckingUsernmae && <Loader2 className="animate-spin"/>}
                    <p className={`text-sm ${usernameMessage === 'Username is avaiable' ? 'text-green-500' : 'text-red-500'}`}>
                        {usernameMessage}
                    </p>
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field >
                    <FieldLabel htmlFor="form-rhf-demo-title">
                      Email
                    </FieldLabel>
                    <input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="email"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    /> 
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field >
                    <FieldLabel htmlFor="form-rhf-demo-title">
                      Password
                    </FieldLabel>
                    <input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="password"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    /> 
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
          <Button type="submit" disabled={isSubmitting}>
            {
              isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin " /> Please wait
                </>
              ) : ('Signup')
            }
          </Button>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:bg-blue-800">Sign in</Link>
          </p>
        </div>
      </div>
    </div> 
  )
}

export default page
