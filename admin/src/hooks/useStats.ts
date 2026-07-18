import { useEffect, useState } from 'react'
import {
  api,
  type Overview,
  type CategoryStat,
  type PlanStat,
  type TopVideo,
  type TimePoint,
} from '../lib/api'

export type Stats = {
  overview: Overview
  byCategory: CategoryStat[]
  byPlan: PlanStat[]
  topVideos: TopVideo[]
  viewsOverTime: TimePoint[]
}

type State = {
  data: Stats | null
  loading: boolean
  error: string | null
}

export function useStats(): State {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    Promise.all([
      api.overview(),
      api.byCategory(),
      api.byPlan(),
      api.topVideos(),
      api.viewsOverTime(),
    ])
      .then(([overview, byCategory, byPlan, topVideos, viewsOverTime]) => {
        if (!cancelled)
          setState({
            data: { overview, byCategory, byPlan, topVideos, viewsOverTime },
            loading: false,
            error: null,
          })
      })
      .catch((e) => {
        if (!cancelled) setState({ data: null, loading: false, error: String(e) })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
