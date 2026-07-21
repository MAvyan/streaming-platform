export function formatDuration(totalSec: number): string {
  const h = Math.floor(totalSec / 3600)
  const m = Math.round((totalSec % 3600) / 60)
  return h > 0 ? `${h}h ${m.toString().padStart(2, '0')}` : `${m} min`
}

export function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

export function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

export function progress(watchedSec: number, durationSec: number): number {
  if (durationSec <= 0) return 0
  return Math.min(100, Math.round((watchedSec / durationSec) * 100))
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

export function matchScore(id: string): number {
  const sum = [...id].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return 70 + (sum % 30)
}
