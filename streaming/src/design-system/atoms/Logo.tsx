export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <span
      className="font-bold text-[1.6rem] tracking-[0.22em] text-ink cursor-pointer select-none leading-none"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      LUMEN
    </span>
  )
}
