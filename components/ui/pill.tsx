import { cn } from "@/lib/utils"

interface PillProps extends React.ComponentProps<"button"> {
  active?: boolean
}

function Pill({ className, active = false, ...props }: PillProps) {
  return (
    <button
      type="button"
      data-slot="pill"
      className={cn(
        "whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
        active
          ? "bg-[var(--teal-primary)] text-white"
          : "bg-[rgba(159,225,203,0.3)] text-[var(--teal-deep)] hover:bg-[rgba(159,225,203,0.45)]",
        className
      )}
      {...props}
    />
  )
}

export { Pill }
