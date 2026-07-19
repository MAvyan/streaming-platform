import type { ReactNode } from 'react'
import { Footer } from '../organisms/Footer'

type Props = {
  navbar: ReactNode
  children: ReactNode
}

export function BrowseTemplate({ navbar, children }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      {navbar}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
