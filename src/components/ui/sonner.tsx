"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "bg-neutral-900 border-neutral-800 text-white",
          title: "text-white",
          description: "text-neutral-400",
          actionButton: "bg-white text-black",
          cancelButton: "bg-neutral-800 text-white",
          error: "bg-red-950 border-red-800 text-white",
          success: "bg-green-950 border-green-800 text-white",
          warning: "bg-yellow-950 border-yellow-800 text-white",
          info: "bg-blue-950 border-blue-800 text-white",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
