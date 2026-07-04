import { cn } from "@/lib/utils"

interface EyebrowProps extends React.ComponentProps<"p"> {
  onDeep?: boolean
}

function Eyebrow({ className, onDeep = false, ...props }: EyebrowProps) {
  return (
    <p
      data-slot="eyebrow"
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.18em]",
        onDeep ? "text-[var(--teal-soft)]" : "text-[var(--teal-primary)]",
        className
      )}
      {...props}
    />
  )
}

export { Eyebrow }
