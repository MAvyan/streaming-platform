import type { ReactNode } from 'react'
import { Footer } from '../organisms/Footer'
import './BrowseTemplate.css'

type Props = {
  navbar: ReactNode
  children: ReactNode
}

export function BrowseTemplate({ navbar, children }: Props) {
  return (
    <div className="browse">
      {navbar}
      <main className="browse__main">{children}</main>
      <Footer />
    </div>
  )
}
