import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { generateQRCode, generateQRCodeSVG } from '@/lib/qr'
import { QRDownloadButtons } from './QRDownloadButtons'

export const metadata: Metadata = { title: 'QR Code' }

export default async function QRPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: venue } = await supabase
    .from('venues')
    .select('slug, name')
    .eq('id', id)
    .eq('owner_id', user!.id)
    .single()

  if (!venue) notFound()

  const [pngDataUrl, svgString] = await Promise.all([
    generateQRCode(venue.slug),
    generateQRCodeSVG(venue.slug),
  ])

  const menuUrl = `${process.env.NEXT_PUBLIC_APP_URL}/p/${venue.slug}`

  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      <Link href={`/venues/${id}`} className="text-sm mb-4 block hover:underline" style={{ color: 'var(--stone)' }}>
        ← Back to venue
      </Link>
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--ink)' }}>QR Code</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--stone)' }}>
        This QR code points permanently to{' '}
        <a href={menuUrl} target="_blank" className="underline" style={{ color: 'var(--teal-primary)' }}>
          {menuUrl}
        </a>
      </p>

      <div className="bg-white rounded-2xl border p-8 flex flex-col items-center gap-6" style={{ borderColor: 'var(--teal-soft)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pngDataUrl} alt={`QR code for ${venue.name}`} className="w-64 h-64" />
        <QRDownloadButtons pngDataUrl={pngDataUrl} svgString={svgString} venueName={venue.name} />
      </div>
    </div>
  )
}
