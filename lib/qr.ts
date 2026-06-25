import QRCode from 'qrcode'

export async function generateQRCode(slug: string): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/p/${slug}`
  return QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: { dark: '#0F6E56', light: '#FFFFFF' },
  })
}

export async function generateQRCodeSVG(slug: string): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/p/${slug}`
  return QRCode.toString(url, {
    type: 'svg',
    margin: 2,
    color: { dark: '#0F6E56', light: '#FFFFFF' },
  })
}
