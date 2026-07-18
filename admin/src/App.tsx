import { useStats } from './hooks/useStats'
import { DashboardLayout } from './design-system/templates/DashboardLayout'
import { KpiCard } from './design-system/molecules/KpiCard'
import { ChartCard } from './design-system/molecules/ChartCard'
import { LineChart } from './design-system/organisms/LineChart'
import { BarChart } from './design-system/organisms/BarChart'
import { DonutChart, type DonutDatum } from './design-system/organisms/DonutChart'
import { TopVideosTable } from './design-system/organisms/TopVideosTable'
import { compact, fullNumber } from './lib/format'
import './App.css'

const PLAN_META: Record<string, { label: string; color: string }> = {
  FREE: { label: 'Gratuit', color: 'var(--series-1)' },
  STANDARD: { label: 'Standard', color: 'var(--series-2)' },
  PREMIUM: { label: 'Premium', color: 'var(--series-3)' },
}
const PLAN_ORDER = ['FREE', 'STANDARD', 'PREMIUM']

function App() {
  const { data, loading, error } = useStats()

  let body
  if (error) {
    body = <p className="dash__state">Statistiques indisponibles ({error}).</p>
  } else if (loading || !data) {
    body = <p className="dash__state">Chargement des statistiques…</p>
  } else {
    const { overview, byCategory, byPlan, topVideos, viewsOverTime } = data

    const donut: DonutDatum[] = PLAN_ORDER.map((plan) => {
      const found = byPlan.find((p) => p.plan === plan)
      return {
        label: PLAN_META[plan].label,
        color: PLAN_META[plan].color,
        value: found?.users ?? 0,
      }
    })

    body = (
      <div className="dash">
        <div className="dash__kpis">
          <KpiCard label="Abonnés" value={fullNumber(overview.totalUsers)} icon="users" delta={12.4} />
          <KpiCard label="Titres au catalogue" value={fullNumber(overview.totalVideos)} icon="film" delta={3.1} />
          <KpiCard label="Visionnages (30 j)" value={compact(overview.totalViews)} icon="eye" delta={8.7} />
          <KpiCard label="Heures visionnées" value={compact(overview.totalWatchHours)} icon="clock" delta={5.2} />
        </div>

        <ChartCard
          title="Visionnages par jour"
          subtitle="30 derniers jours"
          className="dash__wide"
        >
          <LineChart data={viewsOverTime} />
        </ChartCard>

        <div className="dash__row">
          <ChartCard title="Visionnages par catégorie">
            <BarChart data={byCategory} />
          </ChartCard>
          <ChartCard title="Répartition des abonnés">
            <DonutChart data={donut} />
          </ChartCard>
        </div>

        <ChartCard title="Titres les plus regardés" className="dash__wide">
          <TopVideosTable data={topVideos} />
        </ChartCard>
      </div>
    )
  }

  return (
    <DashboardLayout
      active="overview"
      title="Vue d'ensemble"
      subtitle="Activité de la plateforme"
    >
      {body}
    </DashboardLayout>
  )
}

export default App
