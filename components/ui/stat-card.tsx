import { cn } from "@/lib/utils"

interface StatCardProps extends React.ComponentProps<"div"> {
  label: string
  value: React.ReactNode
  sub?: React.ReactNode
  subTone?: "teal" | "live" | "stone"
  floating?: boolean
}

function StatCard({
  className,
  label,
  value,
  sub,
  subTone = "teal",
  floating = true,
  ...props
}: StatCardProps) {
  return (
    <div
      data-slot="stat-card"
      className={cn(
        "min-w-[160px] rounded-xl bg-white p-3.5",
        floating ? "shadow-xl" : "border border-[var(--teal-soft)]",
        className
      )}
      {...props}
    >
      <p className="m-0 text-xs font-medium text-[var(--stone)]">{label}</p>
      <p
        className="m-0 mt-0.5 text-[26px] leading-[1.1] font-bold text-[var(--teal-deep)]"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        {value}
      </p>
      {sub && (
        <p
          className={cn(
            "m-0 mt-0.5 text-xs",
            subTone === "stone" ? "text-[var(--stone)]" : "text-[var(--teal-primary)]"
          )}
        >
          {sub}
        </p>
      )}
    </div>
  )
}

export { StatCard }
