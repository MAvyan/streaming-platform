import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger'
}

const variants = {
  primary: 'bg-accent text-white hover:bg-accent-ink',
  ghost: 'border border-line text-secondary hover:bg-panel hover:text-ink',
  danger: 'bg-critical text-white hover:brightness-95',
}

export function Button({ variant = 'ghost', className = '', ...rest }: Props) {
  return (
    <button
      className={`inline-flex cursor-pointer items-center gap-2 rounded-chip px-3 py-2 text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...rest}
    />
  )
}
