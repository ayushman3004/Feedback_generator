"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LogOut, Home, UserPen, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500 hover:to-white transition-all duration-300">
          Feedback Void
        </Link>

        {session ? (
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative group focus:outline-none">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-200"></div>
                <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-black border border-white/10 overflow-hidden">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-white">
                      {user?.username?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                </div>
              </button>
            </PopoverTrigger>

            <PopoverContent className="w-64 p-0 bg-neutral-900/90 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden mt-2 mr-4">
              <div className="p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-semibold text-white truncate text-sm">{user?.username || user?.name}</p>
                    <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-2 space-y-1">
                {/* <Link href="/profile" className="w-full">
                  <Button variant="ghost" className="w-full justify-start text-neutral-300 hover:text-white hover:bg-white/10 h-9 px-3">
                    <UserPen className="w-4 h-4 mr-2" /> Edit Profile
                  </Button>
                </Link> */}

                <Link href="/" className="w-full block">
                  <Button variant="ghost" className="w-full justify-start text-neutral-300 hover:text-white hover:bg-white/10 h-9 px-3">
                    <Home className="w-4 h-4 mr-2" /> Home
                  </Button>
                </Link>
              </div>

              <div className="h-px bg-white/10 mx-2 my-1"></div>

              <div className="p-2">
                <Button
                  onClick={() => signOut()}
                  variant="ghost"
                  className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 h-9 px-3"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Link href="/sign-in">
            <Button
              className="bg-white text-black hover:bg-neutral-200 font-medium rounded-full px-6 transition-all"
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
