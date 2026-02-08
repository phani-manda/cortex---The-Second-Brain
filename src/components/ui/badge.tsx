import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all overflow-hidden hover:shadow-md",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-zinc-600 to-zinc-500 text-white hover:shadow-zinc-500/30 [a&]:hover:from-zinc-500 [a&]:hover:to-zinc-400",
        secondary:
          "bg-zinc-500/20 text-zinc-300 border-zinc-500/30 [a&]:hover:bg-zinc-500/30",
        destructive:
          "bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-zinc-500/30 text-zinc-300 [a&]:hover:bg-zinc-500/20 [a&]:hover:text-zinc-200",
        ghost: "[a&]:hover:bg-zinc-500/20 [a&]:hover:text-zinc-200",
        link: "text-zinc-400 underline-offset-4 [a&]:hover:underline",
        glow: "bg-zinc-500/20 text-zinc-300 border-zinc-400/50 shadow-sm shadow-zinc-500/20 hover:shadow-zinc-400/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
