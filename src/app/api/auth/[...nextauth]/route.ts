// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import { authOptions } from "./options"

// NextAuth now returns an object with handlers + auth helper
const { handlers, auth } = NextAuth(authOptions)

// Export GET and POST from handlers
export const { GET, POST } = handlers

// (optional) also export auth for middleware use
export { auth }
