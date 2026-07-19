type Props = {
  children: React.ReactNode
  tone?: 'neutral' | 'good' | 'critical'
}

const tones = {
  neutral: 'bg-surface-3 text-secondary',
  good: 'bg-good/15 text-good',
  critical: 'bg-critical/15 text-critical',
}

export function Badge({ children, tone = 'neutral' }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium leading-normal ${tones[tone]}`}
    >
      {children}
    </span>
  )
}
