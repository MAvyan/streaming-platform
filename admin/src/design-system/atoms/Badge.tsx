type Props = {
  children: React.ReactNode
  tone?: 'neutral' | 'good' | 'critical'
}

const tones = {
  neutral: 'border-line text-secondary',
  good: 'border-good/40 text-good',
  critical: 'border-critical/40 text-critical',
}

export function Badge({ children, tone = 'neutral' }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-chip border px-1.5 py-0.5 text-[10px] uppercase tracking-[0.08em] leading-normal ${tones[tone]}`}
    >
      {children}
    </span>
  )
}
