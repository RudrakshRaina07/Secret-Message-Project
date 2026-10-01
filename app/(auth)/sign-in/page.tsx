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
import { signinSchema } from "@/app/Schema/signinSchema";
import { signIn } from "next-auth/react";
import da from "zod/v4/locales/da.cjs";

const page = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    const result = await signIn('credentials', {
      identifier: data.identifier,
      password: data.password
    })

    if(result?.error){
      toast.add({
        type: "error",
        title: "Sign in failed",
        description: "Incorrect email or password"
      })
    }

    if(result?.url){
      router.replace('/dashboard')
    }
  }
  
  return (
    <div className="flex justify-center items-center bg-gray-400 min-h-screen">
      <div className="w-max max-w-md p-8 space-y-8 shadow-md bg-white rounded-xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Mystery Message</h1>
          <p className="mb-4f">Sign in to start your anonymous adventure</p>
        </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <Controller
                name="identifier"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field >
                    <FieldLabel htmlFor="form-rhf-demo-title">
                      Email/Username
                    </FieldLabel>
                    <input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="email/username"
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
            <Button type="submit">
                Sign In
            </Button>
          </form>
      </div>
    </div> 
  )
}

export default page
