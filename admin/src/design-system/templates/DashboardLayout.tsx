import { useState, type ReactNode } from 'react'
import { Sidebar } from '../organisms/Sidebar'
import { Topbar } from '../organisms/Topbar'
import './DashboardLayout.css'

type Props = {
  active: string
  title: string
  subtitle?: string
  children: ReactNode
}

export function DashboardLayout({ active, title, subtitle, children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="layout">
      <Sidebar active={active} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="layout__main">
        <Topbar title={title} subtitle={subtitle} onMenu={() => setMenuOpen(true)} />
        <main className="layout__content">{children}</main>
      </div>
    </div>
  )
}
