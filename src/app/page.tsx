"use client";

import { Spotlight } from "@/components/ui/spotlight-new";
import Link from "next/link";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import messages from "@/messages.json";

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

        {/* Infinite Moving Cards */}
        <div className="mt-16 w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
          <InfiniteMovingCards
            items={messages.map((m) => ({
              quote: m.content,
              name: m.received,
              title: m.title,
            }))}
            direction="right"
            speed="slow"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 bg-black text-neutral-400 text-center text-sm">
        © 2025 Feedback Generator. All rights reserved.
      </footer>
    </>
  );
}
