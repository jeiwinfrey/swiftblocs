import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva("w-full relative", {
  variants: {
    variant: {
      inner: [
        "border-[0.5px] rounded-md p-1",
        "border-zinc-300 dark:border-zinc-800",
      ],
    },
  },
  defaultVariants: {
    variant: "inner",
  },
})

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  title?: string
  description?: string
}

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props}>
    {props.children}
  </div>
))
CardContent.displayName = "CardContent"

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, title, description, children, ...props }, ref) => {
    const content = (
      <CardContent>
        {title && (
          <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-gray-100">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-gray-700 dark:text-gray-300">{description}</p>
        )}
        {children}
      </CardContent>
    )

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, className }))}
        {...props}
      >
        <div className="rounded-md bg-gradient-to-br from-white to-zinc-200/60 dark:border dark:from-zinc-950 dark:to-zinc-900/60 dark:border-zinc-900/50 dark:shadow-inner">
          {content}
        </div>
      </div>
    )
  }
)
Card.displayName = "Card"

export { Card, CardContent, cardVariants }
