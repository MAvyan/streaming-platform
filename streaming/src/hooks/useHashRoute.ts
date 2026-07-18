import { useCallback, useEffect, useState } from 'react'

// Petit routeur maison : l'ouverture d'une fiche est reflétée dans l'URL
// (#/title/<id>), ce qui rend le lien partageable et gère le bouton retour.
function parse(hash: string): string | null {
  const match = hash.match(/^#\/title\/(.+)$/)
  return match ? decodeURIComponent(match[1]) : null
}

export function useTitleRoute() {
  const [titleId, setTitleId] = useState<string | null>(() => parse(window.location.hash))

  useEffect(() => {
    const onChange = () => setTitleId(parse(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const openTitle = useCallback((id: string) => {
    window.location.hash = `#/title/${encodeURIComponent(id)}`
  }, [])

  const closeTitle = useCallback(() => {
    if (parse(window.location.hash)) window.history.back()
  }, [])

  return { titleId, openTitle, closeTitle }
}
