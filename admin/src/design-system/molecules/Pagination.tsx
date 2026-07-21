import { Button } from '../atoms/Button'

type Props = {
  page: number
  pageCount: number
  from: number
  to: number
  total: number
  unit: string
  onChange: (page: number) => void
}

export function Pagination({ page, pageCount, from, to, total, unit, onChange }: Props) {
  if (pageCount <= 1) return null

  return (
    <nav
      aria-label="Pagination"
      className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4"
    >
      <p className="eyebrow" role="status">
        {from}–{to} sur {total} {unit}
      </p>
      <div className="ml-auto flex items-center gap-3">
        <span className="eyebrow">
          Page {page} sur {pageCount}
        </span>
        <Button onClick={() => onChange(page - 1)} disabled={page <= 1}>
          Précédent
        </Button>
        <Button onClick={() => onChange(page + 1)} disabled={page >= pageCount}>
          Suivant
        </Button>
      </div>
    </nav>
  )
}
