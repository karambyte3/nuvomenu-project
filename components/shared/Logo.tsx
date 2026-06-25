interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'full' | 'icon'
  light?: boolean
}

export default function Logo({ size = 'md', variant = 'full', light = false }: LogoProps) {
  const iconSize = size === 'sm' ? 32 : size === 'lg' ? 56 : 40
  const textColor = light ? '#FFFFFF' : '#0F6E56'

  const icon = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Rounded square background */}
      <rect width="56" height="56" rx="14" fill="#0F6E56" />
      {/* Soft teal arc beneath the N */}
      <path
        d="M14 40 Q28 48 42 40"
        stroke="#9FE1CB"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      {/* Serif N — bold, centered */}
      <text
        x="28"
        y="37"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="30"
        fontWeight="700"
        fill="#FFFFFF"
        letterSpacing="-1"
      >
        N
      </text>
    </svg>
  )

  if (variant === 'icon') return icon

  const stackedText = (
    <div className="flex flex-col leading-none">
      <span
        className="tracking-[0.18em] uppercase"
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontSize: size === 'sm' ? '9px' : size === 'lg' ? '13px' : '11px',
          fontWeight: 600,
          color: textColor,
          letterSpacing: '0.18em',
        }}
      >
        NUVO
      </span>
      <span
        style={{
          fontFamily: 'var(--font-fraunces)',
          fontSize: size === 'sm' ? '17px' : size === 'lg' ? '26px' : '21px',
          fontWeight: 700,
          color: textColor,
          lineHeight: 1,
        }}
      >
        menu
      </span>
    </div>
  )

  return (
    <div className="flex items-center gap-2.5">
      {icon}
      {stackedText}
    </div>
  )
}
