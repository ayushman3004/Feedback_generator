'use client'
import React from 'react'
import { signOut } from 'next-auth/react'
const page = () => {
    
  return (
    <div>
      Dashboard
    <button
      onClick={() => signOut()} // redirect after logout
      className="text-red-600"
    >
      Logout
    </button>
    </div>
  )
}

export default page
