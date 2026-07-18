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

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`)
  if (!res.ok) throw new Error(`API ${path} -> ${res.status}`)
  return res.json() as Promise<T>
}

export const api = {
  overview: () => get<Overview>('/stats/overview'),
  byCategory: () => get<CategoryStat[]>('/stats/by-category'),
  byPlan: () => get<PlanStat[]>('/stats/by-plan'),
  topVideos: () => get<TopVideo[]>('/stats/top-videos'),
  viewsOverTime: () => get<TimePoint[]>('/stats/views-over-time'),
}
