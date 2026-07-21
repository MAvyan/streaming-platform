import type { ReactNode } from 'react'

type Props = {
  title: string
  meta?: ReactNode
  children: ReactNode
  className?: string
}

export function Panel({ title, meta, children, className = '' }: Props) {
  return (
    <section className={`flex min-w-0 flex-col bg-bg px-6 py-6 max-[860px]:px-4 ${className}`}>
      <header className="mb-6 flex items-baseline justify-between gap-3 border-b border-line pb-3">
        <h2 className="text-[13px] font-semibold tracking-[-0.01em]">{title}</h2>
        {meta && <span className="eyebrow shrink-0">{meta}</span>}
      </header>
      <div className="min-w-0 flex-1">{children}</div>
    </section>
  )
}
