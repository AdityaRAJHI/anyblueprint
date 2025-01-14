import './globals.css'
import './styles/carousel-animations.css'
import './styles/blueprint.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Project Idea Breakdown',
  description: 'Break down your project ideas into manageable components',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} blueprint-bg min-h-screen`}>
        <div className="ruler-top">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="ruler-marks" style={{ left: `${(i + 1) * 100}px` }}>
              {(i + 1) * 100}
            </span>
          ))}
        </div>
        <div className="ruler-left">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="ruler-marks" style={{ top: `${(i + 1) * 100}px` }}>
              {(i + 1) * 100}
            </span>
          ))}
        </div>
        {children}
      </body>
    </html>
  )
}
