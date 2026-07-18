import './Skeleton.css'

export function Skeleton({ width = '100%', height = 16, radius = 4 }: {
  width?: string | number
  height?: string | number
  radius?: number
}) {
  return <span className="skeleton" style={{ width, height, borderRadius: radius }} />
}
