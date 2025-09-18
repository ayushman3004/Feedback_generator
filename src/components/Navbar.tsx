"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Feedback Generator
        </a>

        {session ? (
          <Popover>
            <PopoverTrigger asChild>
              <button className="focus:outline-none">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt="Profile Picture"
                    className="w-10 h-10 rounded-full border border-gray-500"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-white">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </button>
            </PopoverTrigger>

            <PopoverContent className="w-56">
              <div className="flex flex-col items-center text-center">
                {user?.image && (
                  <img
                    src={user.image}
                    alt="Profile Picture"
                    className="w-16 h-16 rounded-full mb-2"
                  />
                )}
                <p className="font-semibold">{user?.username || user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <Button className="bg-orange-500 rounded-full w-full">
                  Edit Profile
                </Button>
                <Button className="bg-orange-500 rounded-full w-full">
                  <Link href={"/"}>Home</Link>
                </Button>
                <Button
                  onClick={() => signOut()}
                  className="w-full bg-slate-100 text-black"
                  variant="outline"
                >
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Link href="/sign-in">
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant={"outline"}
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
