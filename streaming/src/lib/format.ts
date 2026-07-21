export function formatDuration(totalSec: number): string {
  const h = Math.floor(totalSec / 3600)
  const m = Math.round((totalSec % 3600) / 60)
  return h > 0 ? `${h}h ${m.toString().padStart(2, '0')}` : `${m} min`
}

export function matchScore(id: string): number {
  const sum = [...id].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return 70 + (sum % 30)
}
