import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BloomShelf — Beauty & Home',
  description: 'Curated beauty tools and home organisation for the modern woman.',
  openGraph: {
    title: 'BloomShelf',
    description: 'Curated beauty tools and home organisation.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
