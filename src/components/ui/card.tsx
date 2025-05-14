import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva("w-full relative", {
  variants: {
    variant: {
      inner: [
        "border-[0.5px] rounded-md p-1",
        "border-border",
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
  <div ref={ref} className={cn("p-2", className)} {...props}>
    {props.children}
  </div>
))
CardContent.displayName = "CardContent"

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, title, description, children, ...props }, ref) => {
    const content = (
      <CardContent>
        {title && (
          <h3 className="text-lg font-bold mb-1 text-foreground">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-muted-foreground">{description}</p>
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
        <div className="rounded-md bg-card text-card-foreground">
          {content}
        </div>
      </div>
    )
  }
)
Card.displayName = "Card"

export { Card, CardContent, cardVariants }
