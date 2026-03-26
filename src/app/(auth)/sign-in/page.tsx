"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { signInSchema } from "@/Schemas/signInSchema";
import { toast } from "sonner";
import { Spotlight } from "@/components/ui/spotlight-new";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  //zodd implementation
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

const onSubmit = async (data: z.infer<typeof signInSchema>) => {
  setIsSubmitting(true);

  const logIn = await signIn("credentials", {
    redirect: false,
    identifier: data.identifier,
    password: data.password,
  });

  setIsSubmitting(false);

  if (logIn?.error) {
    toast("User login failed");
  }

  if (logIn?.ok) {
    window.location.href = "/dashboard"; // 🔥 FINAL FIX
  }
};
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight />
      <div className="z-10 w-full max-w-md p-8 space-y-8 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl relative">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white/90">
            Welcome Back
          </h1>
          <p className="text-neutral-400">Log In to see your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-300">Email/Username</FormLabel>
                  <Input
                    placeholder="email/Username"
                    {...field}
                    className="bg-neutral-900/50 border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-neutral-700"
                  />
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
                    placeholder="Password"
                    {...field}
                    className="bg-neutral-900/50 border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-neutral-700"
                  />
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <Button
              className="w-full bg-slate-100 text-black hover:bg-slate-200 transition-all font-semibold"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className="text-neutral-400 text-sm">
            Not a member? {" "}
            <Link href="/sign-up" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
