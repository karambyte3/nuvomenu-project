'use client'

export function QRDownloadButtons({
  pngDataUrl,
  svgString,
  venueName,
}: {
  pngDataUrl: string
  svgString: string
  venueName: string
}) {
  function downloadPNG() {
    const a = document.createElement('a')
    a.href = pngDataUrl
    a.download = `${venueName}-qr.png`
    a.click()
  }

  function downloadSVG() {
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${venueName}-qr.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex gap-3 w-full">
      <button
        onClick={downloadPNG}
        className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium"
        style={{ backgroundColor: 'var(--teal-primary)' }}
      >
        Download PNG
      </button>
      <button
        onClick={downloadSVG}
        className="flex-1 py-2.5 rounded-lg text-sm font-medium border"
        style={{ borderColor: 'var(--teal-soft)', color: 'var(--teal-deep)' }}
      >
        Download SVG
      </button>
    </div>
  )
}
