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

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`)
  if (!res.ok) throw new Error(`API ${path} -> ${res.status}`)
  return res.json() as Promise<T>
}

export const api = {
  videos: () => get<Video[]>('/videos'),
  categories: () => get<string[]>('/videos/categories'),
}
