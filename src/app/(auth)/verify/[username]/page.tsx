"use client"

import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useState } from "react"
import { verifySchema } from "@/Schemas/verifySchema" // adjust path
import { ApiResponse } from "@/types/ApiResponse" // adjust path
import { 
  Form, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const VerifyAccount = () => {
  const router = useRouter()
  const params = useParams<{ username: string }>()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof verifySchema>>({
  resolver: zodResolver(verifySchema),
  defaultValues: {
    verifyCode: "", // 👈 avoids uncontrolled → controlled issue
  },
})

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      setLoading(true)
      await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.verifyCode,
      })

      router.replace("/sign-in") // ✅ fixed path
    } catch (error) {
      console.error(error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data?.message || "Something went wrong"

      // ✅ show error under the input field
      form.setError("verifyCode", { message: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Verify Your Account
        </h1>
        <p className="mb-4">Enter the verification code sent to your email</p>
      </div>

      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="verifyCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} placeholder="code" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default VerifyAccount
