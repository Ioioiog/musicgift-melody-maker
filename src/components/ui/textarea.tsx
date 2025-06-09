
import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-base ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:border-orange-500 focus-visible:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical transition-all duration-200",
        className
      )}
      ref={ref}
      {...props}
    />
  )
}
)
Textarea.displayName = "Textarea"

export { Textarea }
