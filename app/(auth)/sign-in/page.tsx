import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/navigation";
import { signupSchema } from "@/app/Schema/signupSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/app/types/ApiResponse";
import { router } from "next/client";

const page = () => {
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsernmae, setIsCheckingUsernmae] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debouncedUsername = useDebounceValue(username, 300)
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
      if(debouncedUsername){
        setUsernameMessage('')
        setIsCheckingUsernmae(true)

        try {
          const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)

          setUsernameMessage(response.data.message)

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

  }, [debouncedUsername])

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
    <div>
      
    </div>
  )
}

export default page
