import { useEffect, useMemo, useState } from 'react'
import { useCatalog, groupByCategory } from './hooks/useCatalog'
import { useSection, useTitleRoute } from './hooks/useHashRoute'
import type { Video } from './lib/api'
import { Navbar } from './design-system/organisms/Navbar'
import { Hero } from './design-system/organisms/Hero'
import { Carousel } from './design-system/organisms/Carousel'
import { VideoGrid } from './design-system/organisms/VideoGrid'
import { DetailModal } from './design-system/organisms/DetailModal'
import { BrowseTemplate } from './design-system/templates/BrowseTemplate'
import { Profile } from './pages/Profile'

function App() {
  const { videos, categories, loading, error } = useCatalog()
  const { titleId, openTitle, closeTitle } = useTitleRoute()
  const section = useSection()

  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [playing, setPlaying] = useState(false)

  const selected = useMemo(
    () => videos.find((v) => v.id === titleId) ?? null,
    [videos, titleId],
  )

  useEffect(() => {
    if (!titleId) setPlaying(false)
  }, [titleId])

  const open = (video: Video) => openTitle(video.id)
  const play = (video: Video) => {
    setPlaying(true)
    openTitle(video.id)
  }

  const goBrowse = () => {
    if (section === 'profile') window.location.hash = '#/'
  }

  const goHome = () => {
    setActiveCategory(null)
    setSearch('')
    goBrowse()
  }

  const rows = useMemo(() => groupByCategory(videos), [videos])
  const featured = videos[0]

  const results = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return []
    return videos.filter(
      (v) =>
        v.title.toLowerCase().includes(q) || v.category.toLowerCase().includes(q),
    )
  }, [videos, search])

  const navbar = (
    <Navbar
      categories={categories}
      activeCategory={activeCategory}
      onSelectCategory={(c) => {
        setActiveCategory(c)
        setSearch('')
        goBrowse()
      }}
      search={search}
      onSearch={(value) => {
        setSearch(value)
        if (value.trim()) goBrowse()
      }}
      onHome={goHome}
      profileActive={section === 'profile'}
    />
  )

  let content
  if (section === 'profile') {
    content = <Profile onOpen={openTitle} />
  } else if (error) {
    content = <p className="px-[var(--page-x)] pt-[136px] text-center text-muted">Contenu indisponible ({error}).</p>
  } else if (loading) {
    content = <p className="px-[var(--page-x)] pt-[136px] text-center text-muted">Chargement du catalogue…</p>
  } else if (search.trim()) {
    content = (
      <VideoGrid title={`Résultats pour « ${search.trim()} »`} videos={results} onOpen={open} />
    )
  } else if (activeCategory) {
    content = (
      <VideoGrid
        title={activeCategory}
        videos={videos.filter((v) => v.category === activeCategory)}
        onOpen={open}
      />
    )
  } else {
    content = (
      <>
        {featured && <Hero video={featured} onPlay={play} onInfo={open} />}
        <div className="relative z-[1] mt-[clamp(-80px,-6vw,-40px)]">
          <Carousel
            title="Reprendre la lecture"
            videos={videos.slice(0, 6)}
            onOpen={open}
            ratio="wide"
          />
          <Carousel title="Tendances actuelles" videos={videos.slice(0, 12)} onOpen={open} />
          {rows.map(([category, list]) => (
            <Carousel key={category} title={category} videos={list} onOpen={open} />
          ))}
        </div>
      </>
    )
  }

  return (
    <BrowseTemplate navbar={navbar}>
      {content}
      {selected && (
        <DetailModal
          video={selected}
          playing={playing}
          onPlay={() => setPlaying(true)}
          onStop={() => setPlaying(false)}
          onClose={closeTitle}
        />
      )}
    </BrowseTemplate>
  )
}

export default App
