import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  // Base styles - glassmorphism design with FIXED spacing
  "inline-flex items-center justify-center rounded-full text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-2 [&>svg]:pointer-events-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors touch-manipulation backdrop-blur-sm margin-0 padding-0 line-height-1 vertical-align-baseline border-spacing-0",
  {
    variants: {
      variant: {
        // Default glassmorphism badge
        default:
          "bg-black/10 text-foreground border border-black/20 dark:bg-white/10 dark:border-white/20",
        
        // Primary badge
        primary:
          "bg-primary text-primary-foreground border border-primary [a&]:hover:bg-primary/90",
        
        // Secondary badge
        secondary:
          "bg-secondary text-secondary-foreground border border-border [a&]:hover:bg-secondary/90",
        
        // Glassmorphism badge for use on colored backgrounds
        glass:
          "bg-white/20 text-current border border-white/30 backdrop-blur-sm",
        
        // Count badge for category buttons
        count:
          "bg-white/20 text-current border border-white/30 backdrop-blur-sm",
        
        // Success badge
        success:
          "bg-green-500/10 text-green-700 border border-green-500/20 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30",
        
        // Warning badge
        warning:
          "bg-yellow-500/10 text-yellow-700 border border-yellow-500/20 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30",
        
        // Destructive badge
        destructive:
          "bg-destructive/10 text-destructive border border-destructive/20 [a&]:hover:bg-destructive/20 dark:bg-destructive/20 dark:text-destructive-foreground dark:border-destructive/30",
        
        // Outline badge
        outline:
          "text-foreground border border-input bg-background [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        
        // Muted badge
        muted:
          "bg-muted text-muted-foreground border border-muted",
        
        // Transparent badge
        ghost:
          "bg-transparent text-foreground/70 border-transparent [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
      size: {
        default: "px-2 py-0.5 text-xs leading-none",
        sm: "px-1.5 py-0.25 text-xs leading-none",
        lg: "px-3 py-1 text-sm leading-none",
        icon: "p-1 leading-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props} />
  );
}

export { Badge, badgeVariants }