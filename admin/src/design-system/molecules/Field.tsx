import type { ReactNode } from 'react'

type Props = {
  id: string
  label: string
  error?: string
  hint?: string
  children: ReactNode
}

export function Field({ id, label, error, hint, children }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] font-medium text-secondary">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-[11.5px] text-critical">
          {error}
        </p>
      ) : (
        hint && <p className="text-[11.5px] text-muted">{hint}</p>
      )}
    </div>
  )
}
