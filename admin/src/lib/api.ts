export type Overview = {
  totalUsers: number
  totalVideos: number
  totalViews: number
  totalWatchHours: number
}

export type CategoryStat = { category: string; views: number }
export type PlanStat = { plan: string; users: number }
export type TopVideo = { videoId: string; title: string; category: string; views: number }
export type TimePoint = { date: string; views: number }

export type Video = {
  id: string
  title: string
  description: string
  category: string
  durationSec: number
  releaseYear: number
  maturity: string
  thumbnailUrl: string | null
  backdropUrl: string | null
  createdAt: string
}

export type VideoInput = Omit<Video, 'id' | 'createdAt'>

export class ApiError extends Error {
  status: number
  fields: Record<string, string>

  constructor(message: string, status: number, fields: Record<string, string> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fields = fields
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, init)
  if (!res.ok) {
    let fields: Record<string, string> = {}
    try {
      const body = await res.json()
      if (body && typeof body.errors === 'object') fields = body.errors
    } catch {
      fields = {}
    }
    throw new ApiError(`API ${path} -> ${res.status}`, res.status, fields)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

function send<T>(path: string, method: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export const api = {
  overview: () => request<Overview>('/stats/overview'),
  byCategory: () => request<CategoryStat[]>('/stats/by-category'),
  byPlan: () => request<PlanStat[]>('/stats/by-plan'),
  topVideos: () => request<TopVideo[]>('/stats/top-videos'),
  viewsOverTime: () => request<TimePoint[]>('/stats/views-over-time'),
  videos: () => request<Video[]>('/videos'),
  createVideo: (input: VideoInput) => send<Video>('/videos', 'POST', input),
  updateVideo: (id: string, input: VideoInput) => send<Video>(`/videos/${id}`, 'PATCH', input),
  deleteVideo: (id: string) => request<void>(`/videos/${id}`, { method: 'DELETE' }),
}
