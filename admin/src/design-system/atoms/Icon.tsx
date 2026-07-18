import type { ReactElement } from 'react'

export type IconName =
  | 'dashboard'
  | 'users'
  | 'film'
  | 'clock'
  | 'eye'
  | 'trend-up'
  | 'trend-down'
  | 'menu'
  | 'close'

type Props = {
  name: IconName
  size?: number
  className?: string
}

const paths: Record<IconName, ReactElement> = {
  dashboard: <path d="M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h8v8H3v-8zm10 3h8v5h-8v-5z" />,
  users: (
    <path d="M16 11a4 4 0 10-4-4 4 4 0 004 4zm-8 1a3.5 3.5 0 10-3.5-3.5A3.5 3.5 0 008 12zm0 2c-3 0-6 1.5-6 4v2h8v-2c0-1 .4-1.9 1-2.7A9 9 0 008 14zm8 0c-3 0-6 1.5-6 4v2h12v-2c0-2.5-3-4-6-4z" />
  ),
  film: (
    <path d="M4 3h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1zm2 2v2h2V5H6zm10 0v2h2V5h-2zM6 9v2h2V9H6zm10 0v2h2V9h-2zM6 13v2h2v-2H6zm10 0v2h2v-2h-2zM6 17v2h2v-2H6zm10 0v2h2v-2h-2zm-6-8h4v6h-4V9z" />
  ),
  clock: (
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 10V6h-2v7h6v-2h-4z" />
  ),
  eye: (
    <path d="M12 5c-5 0-9 4.5-10 7 1 2.5 5 7 10 7s9-4.5 10-7c-1-2.5-5-7-10-7zm0 11a4 4 0 110-8 4 4 0 010 8zm0-2a2 2 0 100-4 2 2 0 000 4z" />
  ),
  'trend-up': <path d="M3 17l6-6 4 4 8-8v5h2V4h-7v2h3.6L13 12.2l-4-4L3 15v2z" />,
  'trend-down': <path d="M3 7l6 6 4-4 6.6 6.6H16v2h7v-7h-2v3.6L13 6.2l-4 4L3 4v3z" />,
  menu: <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />,
  close: (
    <path d="M18.3 5.7L12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7l1.4-1.4L10.6 10.6l6.3-6.3z" />
  ),
}

export function Icon({ name, size = 20, className }: Props) {
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
