import type { ReactNode } from 'react'
import { Icon } from '../atoms/Icon'
import { useEscape } from '../../hooks/useEscape'

type Props = {
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

export function Drawer({ title, onClose, children, footer }: Props) {
  useEscape(onClose)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink/25" onClick={onClose} aria-hidden="true" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex w-[460px] max-w-[94vw] flex-col border-l border-line bg-bg shadow-[-8px_0_28px_rgba(18,27,38,0.12)]"
      >
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-line px-6">
          <h2 className="text-[15px] font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="cursor-pointer border-0 bg-transparent text-muted transition-colors hover:text-ink"
          >
            <Icon name="close" size={16} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-line px-6 py-4">
            {footer}
          </footer>
        )}
      </aside>
    </div>
  )
}
