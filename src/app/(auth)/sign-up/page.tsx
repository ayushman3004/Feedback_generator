"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/Schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
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
import { Spotlight } from "@/components/ui/spotlight-new";
import { Loader2 } from "lucide-react"

const SignUp = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMeassage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debouced = useDebounceCallback(setUsername, 300)
  const router = useRouter()

  //zodd implementation
  const form = useForm(
    {
      resolver: zodResolver(signupSchema),
      defaultValues: {
        username: '',
        email: '',
        password: ''
      }
    }
  )
  useEffect(() => {
    const checkUsername = async () => {
      // Don't call API if username is empty
      if (!username) {
        setUsernameMeassage('')
        setIsCheckingUsername(false)
        return
      }

      setIsCheckingUsername(true)
      setUsernameMeassage('') // clear old messages

      try {
        const response = await axios.get(`/api/check-username-unique?username=${username}`)
        setUsernameMeassage(response.data.message)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        setUsernameMeassage(
          axiosError.response?.data.message ?? "Error checking username"
        )
      } finally {
        setIsCheckingUsername(false)
      }
    }

    // Only verify if username is not empty
    if (username) {
      checkUsername()
    } else {
      setUsernameMeassage('') // Reset if user clears input
    }
  }, [username])

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
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
    <div className="min-h-screen w-full flex items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight />
      <div className="z-10 w-full max-w-md p-8 space-y-8 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl relative">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white/90">
            Join Feedback Generator
          </h1>
          <p className="text-neutral-400">Sign up to start your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-300">Username</FormLabel>
                  <Input
                    placeholder="username"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      debouced(e.target.value)
                    }}
                    className="bg-neutral-900/50 border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-neutral-700"
                  />
                  {isCheckingUsername && <Loader2 className="h-4 w-4 animate-spin text-white" />}
                  <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                    {usernameMessage}
                  </p>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-300">Email</FormLabel>
                  <Input
                    placeholder="email"
                    {...field}
                    className="bg-neutral-900/50 border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-neutral-700"
                  />
                  <p className='text-xs text-neutral-500'>We will send you a verification code</p>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-300">Password</FormLabel>
                  <Input
                    type="password"
                    {...field}
                    className="bg-neutral-900/50 border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-neutral-700"
                  />
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <Button
              className='w-full bg-slate-100 text-black hover:bg-slate-200 transition-all font-semibold'
              type="submit"
              disabled={isSubmitting}
            >
              {
                isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : ('Signup')
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className="text-neutral-400 text-sm">
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
