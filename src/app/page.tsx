"use client";

import { Spotlight } from "@/components/ui/spotlight-new";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import messages from "@/messages.json";
import AutoPlay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden px-6 py-12">
        <Spotlight />

        <div className="relative z-10 max-w-5xl w-full text-center space-y-6">
          {/* Title */}
          <h1 className="text-4xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Welcome To <br /> Anonymous Feedback Generator
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Get your true and honest opinions anonymously with our feedback
            generator.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link
              href="/sign-in"
              className="bg-slate-400 hover:bg-slate-500 transition-colors px-6 py-3 rounded-full text-lg font-medium text-white shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Carousel */}
        <div className="mt-16 w-full flex justify-center">
          <Carousel
            plugins={[AutoPlay({ delay: 3000 })]}
            className="w-[90%] max-w-lg"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-3">
                    <Card className="bg-white/10 backdrop-blur-md text-white shadow-lg border border-white/10">
                      <CardHeader className="font-bold text-lg text-center">
                        {message.title}
                      </CardHeader>
                      <CardContent className="flex items-center justify-center p-6">
                        <p className="text-base md:text-lg font-medium text-justify">
                          {message.content}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-white" />
            <CarouselNext className="text-white" />
          </Carousel>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 bg-black text-neutral-400 text-center text-sm">
        © 2025 Feedback Generator. All rights reserved.
      </footer>
    </>
  );
}
