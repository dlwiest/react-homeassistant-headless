import { cn } from "@/lib/utils"

interface ConnectionIndicatorProps {
  isConnected: boolean
  className?: string
}

export function ConnectionIndicator({ isConnected, className }: ConnectionIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-1 text-xs", className)}>
      <div
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isConnected ? "bg-emerald-500" : "bg-red-500"
        )}
      />
      <span className={cn(
        isConnected ? "text-emerald-400" : "text-red-400"
      )}>
        {isConnected ? "Online" : "Offline"}
      </span>
    </div>
  )
}
