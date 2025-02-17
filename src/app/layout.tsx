// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google' // NEBO JINÝ FONT
import '../../styles/globals.css' // ZKONTROLUJ CESTU!

const inter = Inter({ subsets: ['latin'] }) // NEBO JINÝ FONT

export const metadata: Metadata = {
  title: 'Tvoje Aplikace', // ZMĚŇ!
  description: 'Popis tvojí aplikace', // ZMĚŇ!
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body className={inter.className}>{children}</body>
    </html>
  )
}