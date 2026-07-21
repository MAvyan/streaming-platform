type Props = {
  label: string
  value: string
  /** Mesure dérivée des mêmes données, pour donner l'échelle du chiffre principal. */
  detail?: string
}

export function Metric({ label, value, detail }: Props) {
  return (
    <article className="flex flex-col bg-bg px-6 py-5 max-[860px]:px-4">
      <p className="eyebrow">{label}</p>
      <p className="mt-3 text-[2rem] font-medium leading-none tracking-[-0.02em] tabular-nums text-ink max-[520px]:text-[1.7rem]">
        {value}
      </p>
      {detail && <p className="mt-2.5 text-[12.5px] text-muted">{detail}</p>}
    </article>
  )
}
