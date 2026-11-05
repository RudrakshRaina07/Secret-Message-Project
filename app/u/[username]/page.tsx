'use client'
import { ApiResponse } from '@/app/types/ApiResponse';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'

const page = () => {
  const {username} = useParams()

  const [message, setMessage] = useState("")  
  const [suggestMessage, setSuggestMessage] = useState([])

  const sendMessage = async () => {
      try {
        const response = await axios.post('/api/send-messages', 
          {
            username: username,
            content: message
          }
        )

        toast.add({
          type: "success",
          description: "Message send successfully"
        })

      } catch (error) {
        console.error("Error in sending message:", error);

        const axiosError = error as AxiosError<ApiResponse>;

        toast.add({
          type: "error",
          description:
            axiosError.response?.data?.message ?? "Something went wrong",
        });      
      }
  }

  const getMessage = async () => {
      try {
        const response = await axios.post('/api/suggest-messages')

        console.log(response.data);
        
        let ques = response.data.split("||")
        console.log(ques)

        setSuggestMessage(ques)

      } catch (error) {
        console.error("Error in sending message:", error);

        const axiosError = error as AxiosError<ApiResponse>;

        toast.add({
          type: "error",
          description:
            axiosError.response?.data?.message ?? "Something went wrong",
        });      
      }
  }

  return (
    <div className="flex flex-col items-center gap-10 mt-10 h-screen w-full">
      <div className="">
        <h1 className="font-bold text-3xl md:text-5xl text-center">Public Profile Link</h1>
      </div>
      <div className="flex flex-col w-screen items-start max-w-4xl gap-2">
        <p className="text-sm md:text-base">Send anonymous message to </p>
        <input name="" id="" placeholder="Write your anonymous message here"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
          }}
          className="w-full min-h-32 p-3 rounded-lg border border-black outline-none"
        ></input>
      </div>
      <div>
        <Button className="px-6 py-5 font-medium text-lg"
          onClick={sendMessage}
        >Send It</Button>
      </div>
      <div className="h-screen flex w-screen max-w-4xl flex-col gap-4">
        <div className="">
          <Button className="px-6 py-5 font-medium text-lg" onClick={getMessage}>Suggest Messages</Button>
        </div>
        <div className="px-2">
          <p className="text-gray-800">Click on any message below to select it.</p>
        </div>
        <div className=" h-66 border-2 border-gray-300 rounded-2xl p-5">
          <div>
            <h2 className="text-2xl font-bold">Messages</h2>
          </div>
          <div>
            {suggestMessage.map((message, idx) => {
              return <p key={idx}>{message}</p>
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
