import { cn } from "@/lib/utils"

interface CardProps extends React.ComponentProps<"div"> {
  hover?: boolean
}

function Card({ className, hover = false, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-2xl border border-[var(--teal-soft)] bg-white p-6 transition-shadow duration-200",
        hover && "cursor-pointer hover:shadow-md",
        className
      )}
      {...props}
    />
  )
}

export { Card }
