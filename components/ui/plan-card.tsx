import Link from "next/link"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface PlanCardProps {
  name: string
  price: string
  period?: string
  description?: string
  features?: string[]
  cta?: string
  href: string
  featured?: boolean
  badge?: string
  className?: string
}

function PlanCard({
  name,
  price,
  period,
  description,
  features = [],
  cta = "Get started",
  href,
  featured = false,
  badge,
  className,
}: PlanCardProps) {
  const onDeep = !featured
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl p-8",
        featured ? "border border-transparent bg-white" : "border border-[var(--border-on-deep)] bg-[var(--glass-on-deep)]",
        className
      )}
    >
      {badge && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <Badge tone="popular" className="px-3.5 py-1.5 text-xs whitespace-nowrap">
            {badge}
          </Badge>
        </span>
      )}
      <h3 className={cn("m-0 text-lg font-bold", onDeep ? "text-white" : "text-[var(--ink)]")}>{name}</h3>
      {description && (
        <p className={cn("m-0 mb-5 mt-1 text-sm", onDeep ? "text-white/55" : "text-[var(--stone)]")}>
          {description}
        </p>
      )}
      <div className="mb-6">
        <span
          className={cn("text-4xl font-bold", onDeep ? "text-white" : "text-[var(--teal-deep)]")}
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          {price}
        </span>
        {period && (
          <span className={cn("ml-1 text-sm", onDeep ? "text-white/55" : "text-[var(--stone)]")}>{period}</span>
        )}
      </div>
      <ul className="m-0 mb-8 flex flex-1 list-none flex-col gap-3 p-0">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm">
            <span className={cn("font-bold", onDeep ? "text-[var(--teal-soft)]" : "text-[var(--teal-primary)]")}>✓</span>
            <span className={onDeep ? "text-white/75" : "text-[var(--stone)]"}>{f}</span>
          </li>
        ))}
      </ul>
      <Button
        render={<Link href={href} />}
        full
        variant={featured ? "primary" : "secondary"}
        className={featured ? "" : "border border-white/20 bg-white/12 text-white hover:bg-white/20"}
      >
        {cta}
      </Button>
    </div>
  )
}

export { PlanCard }
