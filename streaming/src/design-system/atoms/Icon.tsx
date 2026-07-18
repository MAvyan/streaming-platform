import type { ReactElement } from 'react'

type IconName =
  | 'play'
  | 'pause'
  | 'plus'
  | 'info'
  | 'search'
  | 'close'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'check'
  | 'bell'

type Props = {
  name: IconName
  size?: number
  className?: string
}

const paths: Record<IconName, ReactElement> = {
  play: <path d="M5 3.5v17l14-8.5-14-8.5z" />,
  pause: <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />,
  plus: <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z" />,
  info: (
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  ),
  search: (
    <path d="M21 20l-5.6-5.6a7 7 0 10-1.4 1.4L20 21l1-1zM5 10a5 5 0 1110 0 5 5 0 01-10 0z" />
  ),
  close: (
    <path d="M18.3 5.7L12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7l1.4-1.4L10.6 10.6l6.3-6.3 1.4 1.4z" />
  ),
  'chevron-left': <path d="M15 5l-7 7 7 7 1.4-1.4L10.8 12l5.6-5.6L15 5z" />,
  'chevron-right': <path d="M9 5l7 7-7 7-1.4-1.4L13.2 12 7.6 6.4 9 5z" />,
  'chevron-down': <path d="M12 15l-7-7 1.4-1.4L12 12.2l5.6-5.6L19 8l-7 7z" />,
  check: <path d="M9 16.2l-3.5-3.5L4 14.2 9 19 20 8l-1.5-1.5L9 16.2z" />,
  bell: (
    <path d="M12 22a2.5 2.5 0 002.5-2.5h-5A2.5 2.5 0 0012 22zm7-6v-5a7 7 0 00-5-6.7V4a2 2 0 00-4 0v.3A7 7 0 005 11v5l-2 2v1h18v-1l-2-2z" />
  ),
}

export function Icon({ name, size = 24, className }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  )
}
