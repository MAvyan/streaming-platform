const TINTS = [
  'var(--tint-blue)',
  'var(--tint-teal)',
  'var(--tint-violet)',
  'var(--tint-green)',
  'var(--tint-magenta)',
  'var(--tint-olive)',
  'var(--tint-red)',
]

const BY_CATEGORY: Record<string, string> = {
  'Science-fiction': 'var(--tint-blue)',
  Documentaire: 'var(--tint-teal)',
  Thriller: 'var(--tint-violet)',
  Comédie: 'var(--tint-olive)',
  Drame: 'var(--tint-magenta)',
  Action: 'var(--tint-red)',
}

export function genreTint(category: string): string {
  if (BY_CATEGORY[category]) return BY_CATEGORY[category]
  const sum = [...category].reduce((a, c) => a + c.charCodeAt(0), 0)
  return TINTS[sum % TINTS.length]
}

export function monogram(title: string): string {
  return title.trim().charAt(0).toUpperCase()
}
