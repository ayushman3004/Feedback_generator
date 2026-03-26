"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { verifySchema } from "@/Schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { useSession } from "next-auth/react";

import { Spotlight } from "@/components/ui/spotlight-new";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      verifyCode: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.verifyCode,
      });
      console.log(response)
      // if(response.status === 200){
      //     const { data: session } = useSession();
      //     if(session && session.user){

      //       router.replace("/dashboard");
      //     }
      // }
      router.replace("/sign-in");

    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data?.message || "Something went wrong";

      // ✅ show error under the input field
      form.setError("verifyCode", { message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight />
      <div className="z-10 w-full max-w-md p-8 space-y-8 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl relative">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white/90">
            Verify Your Account
          </h1>
          <p className="text-neutral-400">Enter the verification code sent to your email</p>
        </div>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="verifyCode"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-300">Verification Code</FormLabel>
                    {/* <Input {...field} placeholder="code" /> */}
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} className="bg-neutral-900/50 border-neutral-700 text-white" />
                          <InputOTPSlot index={1} className="bg-neutral-900/50 border-neutral-700 text-white" />
                          <InputOTPSlot index={2} className="bg-neutral-900/50 border-neutral-700 text-white" />
                        </InputOTPGroup>
                        <InputOTPSeparator className="text-white/50" />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} className="bg-neutral-900/50 border-neutral-700 text-white" />
                          <InputOTPSlot index={4} className="bg-neutral-900/50 border-neutral-700 text-white" />
                          <InputOTPSlot index={5} className="bg-neutral-900/50 border-neutral-700 text-white" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <FormMessage className="text-red-400 text-center" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-100 text-black hover:bg-slate-200 transition-all font-semibold"
              >
                {loading ? "Verifying..." : "Verify"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
