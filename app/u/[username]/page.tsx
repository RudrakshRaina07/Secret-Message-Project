'use client'
import { ApiResponse } from '@/app/types/ApiResponse';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { useCompletion } from "@ai-sdk/react";

const page = () => {
  const {username} = useParams()

  const [message, setMessage] = useState("")  
  // how many characters of `completion` have been "typed" on screen so far
  const [shown, setShown] = useState(0);

  const {
    completion,
    complete,
    isLoading,
    error,
    stop,
  } = useCompletion({
    api: "/api/suggest-messages",

    streamProtocol: "text",
  });

  const getMessage = async () => {
    setShown(0); 
    await complete("Generate three suggested messages");
  };

  const completionRef = useRef(completion);
  completionRef.current = completion;

  useEffect(() => {
    const id = setInterval(() => {
      setShown((prev) => {
        const target = completionRef.current.length;
        if (prev >= target) return prev;
        const gap = target - prev;
        return prev + Math.max(1, Math.ceil(gap / 25));
      });
    }, 25);
    return () => clearInterval(id);
  }, []);

  const typedText = completion.slice(0, shown).replace(/\|+$/, "");
  const isTyping = isLoading || shown < completion.length;

  const questions = typedText
    .split("||")
    .map((q) => q.trim())
    .filter(Boolean);

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
          <Button className="px-6 py-5 font-medium text-lg" onClick={getMessage} disabled={isLoading}>
            {isLoading ? "Generating..." : "Suggest Messages"}
          </Button>
        </div>
        <div className="px-2">
          <p className="text-gray-800">Click on any message below to select it.</p>
        </div>
        <div className="h-66 border-2 border-gray-300 rounded-2xl p-5 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Messages</h2>

          <div className="flex flex-col gap-3">

            {/* Suggestions: each box types in, then becomes clickable */}
            {questions.map((msg, idx) => {
              const isCurrent = isTyping && idx === questions.length - 1;
              return (
                <button
                  key={idx}
                  disabled={isCurrent}
                  onClick={() => setMessage(msg)}
                  className="w-full text-center p-3 border rounded-lg hover:bg-gray-100 transition disabled:hover:bg-transparent disabled:cursor-default"
                >
                  {msg}
                  {isCurrent && <span className="animate-pulse ml-0.5">▋</span>}
                </button>
              );
            })}

            {/* Initial state */}
            {!isTyping && questions.length === 0 && !error && (
              <p className="text-gray-500">
                Click Suggest Messages to generate questions.
              </p>
            )}

            {/* Loading state */}
            {isLoading && questions.length === 0 && (
              <p className="text-gray-500 animate-pulse">
                Generating questions...
              </p>
            )}

            {/* Error state */}
            {error && (
              <p className="text-red-500">
                Failed to generate suggestions. Please try again.
              </p>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default page