"use client";

import { useToast as useToastPrimitive } from "@/components/ui/use-toast";

// Simplified toast hook for the example
export function useToast() {
  const { toast, toasts } = useToastPrimitive();

  return {
    toast: ({
      title,
      description,
      variant,
    }: {
      title?: string;
      description?: string;
      variant?: string;
    }) => {
      toast({
        title,
        description,
        variant: variant as "default" | "destructive" | undefined,
      });
    },
    toasts,
  };
}
