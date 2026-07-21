import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const base =
  'w-full rounded-chip border bg-bg px-3 py-2 text-[13px] text-ink transition-colors placeholder:text-muted'

function border(invalid?: boolean) {
  return invalid ? 'border-critical' : 'border-line hover:border-line-strong'
}

type Invalid = { invalid?: boolean }

export function Input({ invalid, className = '', ...rest }: InputHTMLAttributes<HTMLInputElement> & Invalid) {
  return <input className={`${base} ${border(invalid)} ${className}`} aria-invalid={invalid} {...rest} />
}

export function Select({
  invalid,
  className = '',
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & Invalid) {
  return <select className={`${base} ${border(invalid)} ${className}`} aria-invalid={invalid} {...rest} />
}

export function Textarea({
  invalid,
  className = '',
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & Invalid) {
  return (
    <textarea
      className={`${base} ${border(invalid)} resize-y leading-relaxed ${className}`}
      aria-invalid={invalid}
      {...rest}
    />
  )
}
