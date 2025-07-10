"use client"

import { toast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export const useToast = () => {
  return {
    toast: ({ title, description, variant = "default" }: ToastProps) => {
      if (variant === "destructive") {
        toast.error(title || "Error", {
          description,
        })
      } else {
        toast.success(title || "Success", {
          description,
        })
      }
    },
  }
}
