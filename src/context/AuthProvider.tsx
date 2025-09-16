'use client'
import { Session } from "inspector/promises"
import { SessionProvider } from "next-auth/react"
import { Children } from "react"
export default function AuthProvider({
    children,}: Readonly<{children: React.ReactNode}>)
    {
        return (
            <SessionProvider>
                {children}
            </SessionProvider>
        );
    }
