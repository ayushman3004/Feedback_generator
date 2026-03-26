"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Message } from "@/model/user";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessagesSchema } from "@/Schemas/acceptMessages";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw, Copy, Ghost, Link as LinkIcon, Sparkles } from "lucide-react";
import { MessageCard } from "@/components/MessageCard";
import { Spotlight } from "@/components/ui/spotlight-new";
import { motion, AnimatePresence } from "motion/react";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [acceptMessagesState, setAcceptMessagesState] = useState<boolean | null>(null);

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema),
  });
  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-messages", { withCredentials: true });
      setAcceptMessagesState(response.data.isAcceptingMessages); // ✅ update local state
      setValue("acceptMessages", response.data.isAcceptingMessages); // keep RHF in sync
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Failed to fetch message settings");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages", { withCredentials: true });
      setMessages(response.data.messages || []);
      if (refresh) toast.success("Refreshed Messages");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Failed to fetch messages");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchMessages();
      fetchAcceptMessage();
    }
  }, [session, fetchMessages, fetchAcceptMessage]);

  const handleDeleteMessage = async (messageId: string) => {
    setMessages(messages.filter((m) => m._id !== messageId));
    try {
      await axios.delete(`/api/delete-message/${messageId}`);
      toast.success("Message deleted");
      fetchMessages(true);
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const handleSwitchChange = async (val: boolean) => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", { acceptMessages: val });
      setAcceptMessagesState(val); // update local state
      setValue("acceptMessages", val); // keep RHF in sync
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Failed to update setting");
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const username = session?.user?.username;
  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";
  const profileUrl = username ? `${baseUrl}/u/${username}` : "";

  const copyToClipboard = () => {
    if (profileUrl) {
      navigator.clipboard.writeText(profileUrl);
      toast.success("Link copied to clipboard! 📋");
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 relative overflow-hidden flex flex-col items-center pt-24 pb-12 px-4 selection:bg-indigo-500/30">

      {/* Background Noise & Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-black pointer-events-none"></div>

      <div className="absolute -top-40 left-0 md:left-60 md:-top-20 z-0">
        <Spotlight />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10 w-full space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400 drop-shadow-sm">
              Dashboard
            </h1>
            <p className="text-neutral-500 mt-2">Manage your secret messages and settings.</p>
          </div>

          <Button
            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full px-5 py-2 transition-all hover:scale-105 active:scale-95 group backdrop-blur-md"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCcw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            )}
            Refresh Board
          </Button>
        </motion.div>

        {/* Controls Card */}
        {username && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            {/* Link Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <LinkIcon className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Your Public Link</h2>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center w-full gap-2 p-2 bg-neutral-900/80 border border-white/10 rounded-xl">
                  <input
                    type="text"
                    value={profileUrl}
                    disabled
                    className="w-full bg-transparent text-neutral-300 px-4 py-2 focus:outline-none font-mono text-sm md:text-base truncate"
                  />
                  <Button
                    onClick={copyToClipboard}
                    className="shrink-0 bg-white text-black hover:bg-neutral-200 font-medium rounded-lg px-6"
                  >
                    <span className="hidden sm:inline">Copy</span> <Copy className="w-4 h-4 sm:ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="bg-white/5" />

            {/* Settings Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${acceptMessagesState ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  <Sparkles className={`w-5 h-5 ${acceptMessagesState ? 'text-green-400' : 'text-red-400'}`} />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-medium">Accept Messages</span>
                  <span className="text-xs text-neutral-500">{acceptMessagesState ? "You are currently receiving messages from the void." : "Your portal is closed."}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isSwitchLoading && <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />}
                <Switch
                  checked={acceptMessagesState || false}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                  className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-neutral-700"
                />
              </div>
            </div>
          </motion.div>
        )}

        <Separator className="bg-white/5 my-8" />

        {/* Messages Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {messages.length > 0 ? (
              messages.map((message) => (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                >
                  <MessageCard
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-white/10 rounded-3xl bg-white/5"
              >
                <div className="bg-neutral-800/50 p-4 rounded-full">
                  <Ghost className="w-12 h-12 text-neutral-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-white">No messages yet</h3>
                  <p className="text-neutral-500 max-w-xs mx-auto">Share your link to start receiving anonymous feedback!</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Page;
