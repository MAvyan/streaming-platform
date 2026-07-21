import { Button } from '../atoms/Button'
import { useEscape } from '../../hooks/useEscape'

type Props = {
  title: string
  body: string
  confirmLabel: string
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ title, body, confirmLabel, busy, onConfirm, onCancel }: Props) {
  useEscape(onCancel)

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/30" onClick={onCancel} aria-hidden="true" />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-[420px] max-w-full border border-line bg-bg p-6 shadow-[0_10px_36px_rgba(18,27,38,0.18)]"
      >
        <h2 className="text-[15px] font-semibold">{title}</h2>
        <p className="mt-2 text-[13px] leading-relaxed text-secondary">{body}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button onClick={onCancel} disabled={busy}>
            Annuler
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Suppression…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
