import { useEffect, useState } from 'react'
import { api, type HistoryEntry, type Profile } from '../lib/api'

type State = {
  profile: Profile | null
  history: HistoryEntry[]
  loading: boolean
  error: string | null
}

export function useProfile(enabled: boolean): State {
  const [state, setState] = useState<State>({
    profile: null,
    history: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!enabled) return
    let cancelled = false

    Promise.all([api.profile(), api.history()])
      .then(([profile, history]) => {
        if (!cancelled) setState({ profile, history, loading: false, error: null })
      })
      .catch((e) => {
        if (!cancelled) setState({ profile: null, history: [], loading: false, error: String(e) })
      })

    return () => {
      cancelled = true
    }
  }, [enabled])

  return state
}
