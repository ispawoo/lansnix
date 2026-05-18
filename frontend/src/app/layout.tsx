// LANsnix Frontend Layout
// Created by Yasir Ispawoo (https://github.com/ispawoo)

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LANsnix - Realtime LAN Discovery & Monitoring',
  description: 'Your Network. Visualized. Created by Yasir Ispawoo',
  authors: [{ name: 'Yasir Ispawoo', url: 'https://github.com/ispawoo' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" theme="dark" />
      </body>
    </html>
  )
}
