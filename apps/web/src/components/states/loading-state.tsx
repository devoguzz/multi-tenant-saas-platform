import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "Loading...", className }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-gray-500 min-h-[200px]", className)}>
      <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-600" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
