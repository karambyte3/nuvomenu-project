import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-semibold outline-none transition-[opacity,background-color,color,box-shadow] duration-150 select-none focus-visible:ring-3 focus-visible:ring-[var(--teal-primary)]/25 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "border border-transparent bg-[var(--teal-primary)] text-white hover:opacity-90",
        secondary: "border border-transparent bg-[var(--teal-tint)] text-[var(--teal-deep)] hover:opacity-90",
        outline: "border-2 border-[var(--teal-soft)] bg-transparent text-[var(--teal-deep)] hover:bg-[var(--teal-tint)]",
        ghost: "border border-transparent bg-transparent text-[var(--ink)] hover:bg-[var(--teal-tint)]",
        soft: "border border-transparent bg-[var(--teal-soft)] text-[var(--teal-deep)] hover:opacity-90",
        link: "border-none bg-transparent p-0 text-[var(--teal-primary)] underline-offset-4 hover:underline",
      },
      size: {
        sm: "rounded-lg px-3.5 py-[7px] text-[13px]",
        md: "rounded-lg px-5 py-2.5 text-sm",
        lg: "rounded-xl px-7 py-3.5 text-base",
      },
      full: {
        true: "w-full",
      },
    },
    compoundVariants: [{ variant: "link", size: ["sm", "md", "lg"], className: "rounded-none px-0 py-0" }],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "md",
  full,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, full, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
