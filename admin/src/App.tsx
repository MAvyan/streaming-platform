import { useRoute } from './hooks/useRoute'
import { DashboardLayout } from './design-system/templates/DashboardLayout'
import { Overview } from './pages/Overview'
import { Content } from './pages/Content'

const PAGES = {
  overview: {
    title: "Vue d'ensemble",
    subtitle: 'Activité de la plateforme',
    action: (
      <span className="eyebrow shrink-0 border border-line px-2.5 py-1.5 text-secondary">
        30 derniers jours
      </span>
    ),
  },
  content: {
    title: 'Contenus',
    subtitle: 'Catalogue LUMEN',
    action: null,
  },
}

function App() {
  const route = useRoute()
  const page = PAGES[route]

  return (
    <DashboardLayout active={route} title={page.title} subtitle={page.subtitle} action={page.action}>
      {route === 'content' ? <Content /> : <Overview />}
    </DashboardLayout>
  )
}

export default App
