export type Video = {
  id: string
  title: string
  description: string
  category: string
  durationSec: number
  releaseYear: number
  thumbnailUrl: string | null
  backdropUrl: string | null
  maturity: string
}

export type Profile = {
  id: string
  name: string
  email: string
  plan: string
  country: string
  createdAt: string
  stats: {
    views: number
    titles: number
    completed: number
    watchHours: number
  }
}

export type HistoryEntry = {
  id: string
  videoId: string
  title: string
  category: string
  thumbnailUrl: string | null
  backdropUrl: string | null
  durationSec: number
  watchedSec: number
  completed: boolean
  watchedAt: string
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`)
  if (!res.ok) throw new Error(`API ${path} -> ${res.status}`)
  return res.json() as Promise<T>
}

export const api = {
  videos: () => get<Video[]>('/videos'),
  categories: () => get<string[]>('/videos/categories'),
  profile: () => get<Profile>('/users/me'),
  history: () => get<HistoryEntry[]>('/users/me/history'),
}
