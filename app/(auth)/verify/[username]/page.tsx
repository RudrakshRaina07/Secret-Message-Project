'use client'
import { verifySchema } from '@/app/Schema/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from "@/components/ui/toast"
import { ApiResponse } from '@/app/types/ApiResponse';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const verifyAccount = () => {
    const router = useRouter()
    const params = useParams<{username: string}>()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    })

    const onSubmit = async(data: z.infer<typeof verifySchema>) => {
        try {
            console.log("form submitted");
            
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })

            toast.add({
                type: "success",
                description: response.data.message
            })

            router.replace('/sign-in')

        } catch (error) {
            console.error("Error in signup of user: ", error)
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message
            toast.add({
                type: "Signup failed",
                description: errorMessage,
            })
        }
    }

  return (
    <div className="flex justify-center items-center bg-gray-400 min-h-screen">
      <div className="w-max max-w-md p-8 space-y-8 shadow-md bg-white rounded-xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Verify your account</h1>
          <p className="mb-4f">Enter the verification code</p>
        </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <Controller
                name="code"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field >
                        <FieldLabel htmlFor="form-rhf-demo-title">
                        Verification Code
                        </FieldLabel>
                        <input
                        {...field}
                        id="code"
                        placeholder="code"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        /> 
                    </Field>
                )}
              />
            </FieldGroup>
            <Button type="submit">
              Verify
            </Button>
          </form>
         </div>
    </div>           
  )
}

export default verifyAccount
