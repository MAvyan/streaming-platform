import { useEffect, useState } from 'react'
import { api, type Video } from '../lib/api'

type State = {
  videos: Video[]
  categories: string[]
  loading: boolean
  error: string | null
}

export function useCatalog(): State {
  const [state, setState] = useState<State>({
    videos: [],
    categories: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false
    Promise.all([api.videos(), api.categories()])
      .then(([videos, categories]) => {
        if (!cancelled) setState({ videos, categories, loading: false, error: null })
      })
      .catch((e) => {
        if (!cancelled)
          setState((s) => ({ ...s, loading: false, error: String(e) }))
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

export function groupByCategory(videos: Video[]): [string, Video[]][] {
  const map = new Map<string, Video[]>()
  for (const v of videos) {
    const list = map.get(v.category) ?? []
    list.push(v)
    map.set(v.category, list)
  }
  return [...map.entries()]
}
