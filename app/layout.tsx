import type { Metadata } from 'next'
import { Fraunces, DM_Sans, Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Nuvomenu', template: '%s | Nuvomenu' },
  description: 'Digital QR menus for restaurants',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", fraunces.variable, dmSans.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
