'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
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

const specialChar = '||';

const parseStringMessages = (messageString: string) =>
  messageString ? messageString.split(specialChar) : [];

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: '' },
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);

  const { complete } = useCompletion({
    api: '/api/suggest-messages',
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast(response.data.message);
      form.reset({ content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast('Error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
  setIsSuggestLoading(true);
  setSuggestedMessages([]);

  try {
    const prompt = `Generate 5 short anonymous messages someone could send to @${username}. Separate them with "${specialChar}"`;

    const completion = await complete(prompt);

    if (completion) {
      setSuggestedMessages(parseStringMessages(completion));
    }
  } catch (err) {
    console.error('Error fetching messages:', err);
  } finally {
    setIsSuggestLoading(false);
  }
};


  return (
    <div className="container mx-auto my-8 p-6 text-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Send your Message</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to {username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none h-50 "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <Button type="submit" disabled={isLoading || !messageContent}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Send It'
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            {isSuggestLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Suggest Messages'
            )}
          </Button>
          <p>Click on any message below to select it.</p>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {suggestedMessages.length === 0 && !isSuggestLoading ? (
              <p>No messages yet. Click "Suggest Messages".</p>
            ) : (
              suggestedMessages.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div> */}

      <Separator className="my-6" />

      <div className="text-center">
        <div className="mb-4">Want your Own Anonymous Message Board</div>
        <Link href="/">
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}
