"use client"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/Schemas/signUpSchema"
import axios, {  AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

const page = () => {
  const [username,setUsername] = useState('')
  const [usernameMessage,setUsernameMeassage] = useState('')
  const [isCheckingUsername,setIsCheckingUsername] = useState(false)
  const[isSubmitting, setIsSubmitting] = useState(false) 
  const debouced = useDebounceCallback(setUsername,300)
  const router = useRouter()

  //zodd implementation
  const form = useForm(
    {
      resolver: zodResolver(signupSchema),
      defaultValues: {
        username : '',
        email:'',
        password: ''
      }
    }
  )
  useEffect(() => {
    const checkUsername = async () => {
      if(username){
        setIsCheckingUsername(true)
        setUsernameMeassage('')
      }
      try{
        const response = await axios.get(`/api/check-username-unique?username=${username}`)
        setUsernameMeassage(response.data.message)
      }catch(error){
        const axiosError = error as AxiosError<ApiResponse>
        setUsernameMeassage(
          axiosError.response?.data.message ?? "error checking username"
        )
      }finally{setIsCheckingUsername(false)}
    }
    checkUsername()
  }, [username])

  const onSubmit = async (data : z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up',data)
      toast("Success")
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.error(error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message
      toast(`${errorMessage}`)
      setIsSubmitting(false);
    }
  }
  return (
<div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Feedback Generator
          </h1>
          <p className="mb-4">Sign in to continue to build your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input placeholder="username" {...field} 
                  onChange={(e) => {
                    field.onChange(e)
                    debouced(e.target.value)
                  }}
                  />
                  {isCheckingUsername?<Loader2 className="animate-spin " /> : ''}
                  <p className={`text-sm ${username.length === 0 ? '' : `${usernameMessage ? 'text-red-500': 'text-red-500'}`}`}> {usernameMessage}</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>email</FormLabel>
                  <Input placeholder="email" {...field} 
                  />
                  <p className=' text-gray-400 text-sm'>We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full' type="submit" disabled ={isSubmitting}>
                {
                    isSubmitting ? (
                        <>
                            <Loader2  className="mr-2 h-2 w-2 animate-spin"/>
                        </>
                    ):('Signup')
                }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Alreay member ?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page
