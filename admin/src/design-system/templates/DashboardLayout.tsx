import { useState, type ReactNode } from 'react'
import { Sidebar } from '../organisms/Sidebar'
import { Topbar } from '../organisms/Topbar'

type Props = {
  active: string
  title: string
  subtitle?: string
  children: ReactNode
}

export function DashboardLayout({ active, title, subtitle, children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar active={active} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="ml-[232px] flex min-h-screen flex-col max-[860px]:ml-0">
        <Topbar title={title} subtitle={subtitle} onMenu={() => setMenuOpen(true)} />
        <main className="flex-1 p-8 max-[860px]:p-4">{children}</main>
      </div>
    </div>
  )
}
