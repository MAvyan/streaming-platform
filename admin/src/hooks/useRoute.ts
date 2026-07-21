import { useEffect, useState } from 'react'

export type Route = 'overview' | 'content'

const ROUTES: Record<string, Route> = {
  '#/contenus': 'content',
}

function parse(hash: string): Route {
  return ROUTES[hash] ?? 'overview'
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash))

  useEffect(() => {
    const onChange = () => setRoute(parse(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}
