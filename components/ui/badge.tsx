import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center whitespace-nowrap rounded-full text-[11px] font-semibold leading-none px-[9px] py-1",
  {
    variants: {
      tone: {
        new: "bg-[var(--amber-accent)] text-white",
        featured: "bg-[rgba(239,159,39,0.15)] text-[var(--amber-accent)]",
        popular: "bg-[var(--amber-accent)] text-white",
        active: "bg-[var(--teal-tint)] text-[var(--teal-deep)]",
        brand: "bg-[var(--teal-tint)] text-[var(--teal-deep)]",
        neutral: "bg-gray-100 text-[var(--stone)]",
      },
    },
    defaultVariants: {
      tone: "brand",
    },
  }
)

function Badge({
  className,
  tone,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ tone, className }))} {...props} />
}

export { Badge, badgeVariants }
