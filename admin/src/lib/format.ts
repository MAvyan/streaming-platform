export function compact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`
  return String(n)
}

export function fullNumber(n: number): string {
  return n.toLocaleString('fr-FR')
}

export function shortDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

export function duration(totalSec: number): string {
  const minutes = Math.round(totalSec / 60)
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h} h ${m.toString().padStart(2, '0')}` : `${m} min`
}
