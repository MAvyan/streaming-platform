type Props = {
  children: React.ReactNode
  variant?: 'outline' | 'accent'
}

const variants = {
  outline: 'border border-dim text-muted',
  accent: 'bg-accent text-on-accent font-semibold',
}

export function Badge({ children, variant = 'outline' }: Props) {
  return (
    <span
      className={`inline-block text-xs font-medium px-2 py-0.5 rounded leading-snug ${variants[variant]}`}
    >
      {children}
    </span>
  )
}
