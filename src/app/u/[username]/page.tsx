'use client';

'use client';

import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Send, Sparkles, Ghost, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCompletion } from '@ai-sdk/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/Schemas/messageSchema';
import { Spotlight } from "@/components/ui/spotlight-new";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

const specialChar = '||';

const parseStringMessages = (messageString: string) =>
  messageString ? messageString.split(specialChar) : [];

const MOODS = [
  { emoji: "🤫", label: "Secret", color: "bg-neutral-800" },
  { emoji: "🔥", label: "Roast", color: "bg-red-900/40" },
  { emoji: "💖", label: "Adore", color: "bg-pink-900/40" },
  { emoji: "👻", label: "Spooky", color: "bg-purple-900/40" },
  { emoji: "🤔", label: "Curious", color: "bg-blue-900/40" },
];

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [mood, setMood] = useState(MOODS[0]);
  const [charCount, setCharCount] = useState(0);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: '' },
  });

  const messageContent = form.watch('content');

  useEffect(() => {
    setCharCount(messageContent?.length || 0);
  }, [messageContent]);

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
    // Add a tiny flash effect or logic here if desired
  };

  const [isLoading, setIsLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);

  const { complete, completion, isLoading: isCompletionLoading } = useCompletion({
    api: '/api/suggest-messages',
    onFinish: (prompt, completion) => {
      console.log("Completion finished:", completion);
      if (completion) {
        const parsed = parseStringMessages(completion);
        console.log("Parsed messages:", parsed);
        setSuggestedMessages(parsed);
      }
    },
    onError: (error) => {
      console.error("Completion error:", error);
      toast.error("Failed to generate ideas");
    }
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-messages', {
        ...data,
        username,
      });

      toast.success("Message delivered anonymously ✨");
      form.reset({ content: '' });
      setMood(MOODS[0]);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

 const fetchSuggestedMessages = async () => {
  setSuggestedMessages([]);

  try {
    const prompt = `Generate exactly 5 short ${mood.label.toLowerCase()} anonymous messages that someone could send to @${username}. 
      
IMPORTANT: 
- Separate each message with exactly "${specialChar}"
- Do not add any explanations
- Just output the 5 messages separated by ${specialChar}`;

    console.log("Fetching suggestions with prompt:", prompt);

    const res = await fetch('/api/suggest-messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    console.log("API RESPONSE 👉", data);

    if (!data?.text) {
      console.error("No text received");
      return;
    }

    const parsed = parseStringMessages(data.text);
    console.log("Parsed:", parsed);

    setSuggestedMessages(parsed);

  } catch (err) {
    console.error('Error fetching messages:', err);
  }
};


  return (
    <div className="min-h-screen w-full bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500/30">
      {/* Background Noise & Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-black pointer-events-none"></div>

      <div className="absolute -top-40 left-0 md:left-60 md:-top-20">
        <Spotlight />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="z-10 w-full max-w-3xl space-y-10"
      >
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 drop-shadow-[0_0_30px_rgba(165,180,252,0.2)]"
          >
            Send Anonymous Message <br />
            <span className="text-3xl md:text-5xl font-medium text-neutral-400 block mt-2">to <span className="text-white underline decoration-indigo-500/50 underline-offset-4">@{username}</span></span>
          </motion.h1>
          <p className="text-neutral-500 max-w-lg mx-auto text-lg leading-relaxed">
            Send your raw, unfiltered thoughts. No login required for you. <br />
            <span className="italic text-neutral-400">They'll never know it was you.</span>
          </p>
        </div>

        {/* Main Card */}
        <motion.div
          layout
          className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/5 relative overflow-hidden"
        >
          {/* Mood Selector */}
          <div className="mb-6 flex flex-wrap gap-3 justify-center">
            {MOODS.map((m) => (
              <button
                key={m.label}
                onClick={() => setMood(m)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 text-sm font-medium",
                  mood.label === m.label
                    ? `border-white/20 text-white ${m.color} shadow-[0_0_15px_rgba(255,255,255,0.1)] scale-105`
                    : "border-transparent bg-neutral-900/50 text-neutral-400 hover:bg-neutral-800 hover:scale-105"
                )}
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative z-10">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Your Secret Message</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Textarea
                          placeholder="Say something... it stays between you and the void 👀"
                          className="w-full bg-neutral-950/50 border-neutral-800 text-white placeholder:text-neutral-600/70 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 rounded-2xl p-6 min-h-[180px] text-lg md:text-xl resize-none shadow-inner transition-all duration-300 group-hover:border-neutral-700"
                          {...field}
                        />
                        <div className="absolute bottom-4 right-4 text-xs font-mono text-neutral-600 pointer-events-none">
                          {charCount}/300
                        </div>

                        {/* Focus Glow Effect via CSS/div */}
                        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-xl"></div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 mt-2 text-center" />
                  </FormItem>
                )}
              />

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isLoading || !messageContent}
                  className="group relative w-full md:w-auto px-10 py-7 text-lg font-bold bg-white text-black hover:bg-indigo-50 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:shadow-none disabled:scale-100 overflow-hidden"
                >
                  {/* Ripple/Sheen effect container */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-12 z-10 pointer-events-none"></div>

                  <span className="relative z-20 flex items-center gap-3">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin text-neutral-600" />
                        <span className="text-neutral-600">Sending...</span>
                      </>
                    ) : (
                      <>
                        Send It <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>

        {/* AI Suggestions */}
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-3">
            <Button
              onClick={fetchSuggestedMessages}
              variant="ghost"
              size="sm"
              className="group text-neutral-400 hover:text-white hover:bg-white/5 rounded-full px-6 transition-all"
              disabled={isCompletionLoading}
            >
              {isCompletionLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 animate-pulse">Consulting the spirits...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
                  <span>Suggest {mood.label} Messages</span>
                </span>
              )}
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-3 min-h-[100px]">
            <AnimatePresence mode="wait">
              {suggestedMessages.length > 0 ? (
                suggestedMessages.map((message, index) => (
                  <motion.button
                    key={`${index}-${message.substring(0, 5)}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleMessageClick(message)}
                    className="bg-neutral-900/40 hover:bg-neutral-800 border border-white/5 hover:border-indigo-500/30 text-neutral-300 hover:text-white px-6 py-3 rounded-2xl text-sm md:text-base cursor-pointer transition-all duration-300 text-left active:scale-95 leading-relaxed max-w-sm"
                  >
                    {message}
                  </motion.button>
                ))
              ) : (
                !isCompletionLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    className="flex flex-col items-center justify-center p-8 text-neutral-500 border-2 border-dashed border-neutral-800 rounded-3xl w-full max-w-lg"
                  >
                    <Ghost className="w-8 h-8 mb-3 opacity-50" />
                    <p>No messages yet. The void is silent.</p>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-neutral-800 to-transparent my-12" />

        {/* Footer CTA */}
        <motion.div
          className="relative group overflow-hidden bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-white/5 rounded-3xl p-8 text-center"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
          <div className="relative z-10 space-y-6">
            <h3 className="text-2xl font-bold text-white">Want your own board?</h3>
            <p className="text-neutral-400 max-w-sm mx-auto">Collect honest feedback, confessions, or just random thoughts. <br /> <strong className="text-indigo-400">Free. Anonymous. Takes 30 seconds.</strong></p>

            <Link href="/sign-up">
              <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-full px-8 py-6 text-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95 group-hover:border-white/30">
                <Zap className="w-5 h-5 mr-2 text-yellow-400 fill-yellow-400" /> Create Yours
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
