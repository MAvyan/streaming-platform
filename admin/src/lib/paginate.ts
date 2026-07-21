export type Page<T> = {
  items: T[]
  page: number
  pageCount: number
  from: number
  to: number
  total: number
}

export function paginate<T>(items: T[], page: number, size: number): Page<T> {
  const total = items.length
  const pageCount = Math.max(1, Math.ceil(total / size))
  const current = Math.min(Math.max(Math.trunc(page) || 1, 1), pageCount)
  const start = (current - 1) * size

  return {
    items: items.slice(start, start + size),
    page: current,
    pageCount,
    from: total === 0 ? 0 : start + 1,
    to: Math.min(start + size, total),
    total,
  }
}
