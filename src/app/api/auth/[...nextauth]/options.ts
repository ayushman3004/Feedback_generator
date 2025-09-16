// app/api/auth/[...nextauth]/options.ts
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/user"
import NextAuth from "next-auth"

export const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect()
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          })

          if (!user) throw new Error("No user found with this email/username")
          if (!user.isVerified) throw new Error("Please verify your email")

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          )
          if (!isPasswordCorrect) throw new Error("Incorrect password")

          return user
        } catch (err: any) {
          throw new Error(err.message || "Authorization failed")
        }
      },
    }),
  ],

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user._id = token._id as string
        session.user.isVerified = token.isVerified as boolean
        session.user.isAcceptingMessages = token.isAcceptingMessages as boolean
        session.user.username = token.username as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString()
        token.isVerified = user.isVerified
        token.isAcceptingMessages = user.isAcceptingMessages
        token.username = user.username
      }
      return token
    },
  },
}
export default NextAuth(authOptions)