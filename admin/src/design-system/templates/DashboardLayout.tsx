import { useState, type ReactNode } from 'react'
import { Sidebar } from '../organisms/Sidebar'
import { Topbar } from '../organisms/Topbar'

type Props = {
  active: string
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
}

export function DashboardLayout({ active, title, subtitle, action, children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar active={active} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="ml-[212px] flex min-h-screen flex-col max-[860px]:ml-0">
        <Topbar title={title} subtitle={subtitle} action={action} onMenu={() => setMenuOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
