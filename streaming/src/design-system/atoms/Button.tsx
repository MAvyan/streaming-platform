import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'icon'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 font-sans text-[15px] font-medium ' +
  'rounded-btn cursor-pointer whitespace-nowrap text-ink transition-colors select-none ' +
  'active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent font-semibold px-6 py-2.5 hover:bg-accent-hover',
  secondary: 'bg-ink/15 border border-line px-6 py-2.5 hover:bg-ink/25',
  ghost: 'bg-transparent border border-line px-6 py-2.5 hover:bg-ink/10',
  icon: 'bg-black/40 border border-dim rounded-full p-2 w-10 h-10 hover:border-ink hover:bg-black/60',
}

export function Button({ variant = 'primary', children, className = '', ...rest }: Props) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}
