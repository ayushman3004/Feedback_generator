"use client";
import { Spotlight } from "@/components/ui/spotlight-new";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import messages from '@/messages.json'
import AutoPlay from "embla-carousel-autoplay"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
export default function Home() {
  return (
    <>
    <div className="h-screen w-full rounded-md flex flex-col  lg:items-center lg:justify-center md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden p-9 ">
      <Spotlight />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Welcome To
          <br /> anonymous Feedback Generator.
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Get your true and honest opinions anonymously with our feedback
          generator.
        </p>
        <div className="justify-center items-center text-white m-4 flex">
          <p className="mt-5 animate-pulse">
            <Link href="/sign-in" className="bg-slate-400 m-2 p-2 rounded-full ">
              Get Started
            </Link>
          </p>
        </div>
      </div>
      <Carousel 
      plugins={[AutoPlay({delay:2000})]}
      className="h-60 max-w-xs">
      <CarouselContent>
        {
          messages.map((message,index) => (
            <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardHeader>
                  {message.title}
                </CardHeader>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-2xl font-semibold m-3 flex justify-center items-center text-justify">{message.content}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          ))
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    
    </div>
    <div className="flex justify-center items-center text-center w-full text-white">
      <p>@2025 All rights are reserved by FeedbackGenerator</p>
    </div>
    </>
  );
}
