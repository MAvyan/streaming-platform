import { useStats } from '../hooks/useStats'
import { Metric } from '../design-system/molecules/Metric'
import { Notice } from '../design-system/molecules/Notice'
import { Panel } from '../design-system/molecules/Panel'
import { LineChart } from '../design-system/organisms/LineChart'
import { BarChart } from '../design-system/organisms/BarChart'
import { PlanSplit, type PlanDatum } from '../design-system/organisms/PlanSplit'
import { TopVideosTable } from '../design-system/organisms/TopVideosTable'
import { compact, fullNumber } from '../lib/format'

const PLAN_META: Record<string, { label: string; color: string }> = {
  FREE: { label: 'Gratuit', color: 'var(--plan-1)' },
  STANDARD: { label: 'Standard', color: 'var(--plan-2)' },
  PREMIUM: { label: 'Premium', color: 'var(--plan-3)' },
}
const PLAN_ORDER = ['FREE', 'STANDARD', 'PREMIUM']

export function Overview() {
  const { data, loading, error } = useStats()

  if (error) return <Notice>Statistiques indisponibles. Vérifiez que l'API répond, puis rechargez.</Notice>
  if (loading || !data) return <Notice>Lecture des statistiques…</Notice>

  const { overview, byCategory, byPlan, topVideos, viewsOverTime } = data

  const plans: PlanDatum[] = PLAN_ORDER.map((plan) => ({
    label: PLAN_META[plan].label,
    color: PLAN_META[plan].color,
    value: byPlan.find((p) => p.plan === plan)?.users ?? 0,
  }))

  const premiumShare = overview.totalUsers
    ? Math.round(((plans[2]?.value ?? 0) / overview.totalUsers) * 100)
    : 0
  const viewsPerDay = viewsOverTime.length
    ? Math.round(viewsOverTime.reduce((s, d) => s + d.views, 0) / viewsOverTime.length)
    : 0
  const minutesPerView = overview.totalViews
    ? Math.round((overview.totalWatchHours * 60) / overview.totalViews)
    : 0

  return (
    <div className="flex flex-col gap-px bg-line">
      <Panel
        title="Visionnages par jour"
        meta={
          <span className="inline-flex items-center gap-2">
            <span className="h-px w-4" style={{ background: 'var(--reference)' }} aria-hidden="true" />
            moyenne quotidienne
          </span>
        }
      >
        <LineChart data={viewsOverTime} />
      </Panel>

      <div className="grid grid-cols-4 gap-px bg-line max-[1100px]:grid-cols-2 max-[520px]:grid-cols-1">
        <Metric
          label="Abonnés"
          value={fullNumber(overview.totalUsers)}
          detail={`${premiumShare} % en offre Premium`}
        />
        <Metric
          label="Titres au catalogue"
          value={fullNumber(overview.totalVideos)}
          detail={`${byCategory.length} catégories`}
        />
        <Metric
          label="Visionnages · 30 j"
          value={compact(overview.totalViews)}
          detail={`${fullNumber(viewsPerDay)} par jour en moyenne`}
        />
        <Metric
          label="Heures visionnées"
          value={compact(overview.totalWatchHours)}
          detail={`${minutesPerView} min par visionnage`}
        />
      </div>

      <div className="grid grid-cols-[3fr_2fr] gap-px bg-line max-[1100px]:grid-cols-1">
        <Panel title="Visionnages par catégorie" meta={`${byCategory.length} catégories`}>
          <BarChart data={byCategory} />
        </Panel>
        <Panel title="Répartition des abonnés" meta="par offre">
          <PlanSplit data={plans} />
        </Panel>
      </div>

      <Panel title="Titres les plus regardés" meta={`Top ${topVideos.length}`}>
        <TopVideosTable data={topVideos} />
      </Panel>
    </div>
  )
}
