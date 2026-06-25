import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createBuildClient } from '@/lib/supabase/build'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/utils'

export const revalidate = 60

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
  const supabase = createBuildClient()
  const { data } = await supabase.from('venues').select('slug').eq('active', true)
  return data?.map((v) => ({ slug: v.slug })) ?? []
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: venue } = await supabase.from('venues').select('name, description').eq('slug', slug).single()
  if (!venue) return {}
  return {
    title: venue.name,
    description: venue.description ?? undefined,
  }
}

export default async function GuestMenuPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lang?: string }>
}) {
  const { slug } = await params
  const { lang } = await searchParams
  const locale: Locale = SUPPORTED_LOCALES.includes(lang as Locale) ? (lang as Locale) : 'en'

  const supabase = await createClient()

  const { data: venue } = await supabase
    .from('venues')
    .select('id, name, description, address, phone, wifi_password, logo_url, cover_url')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (!venue) notFound()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, position, menu_items(id, name, description, price, old_price, image_url, is_new, is_featured, unavailable, position, item_translations(locale, name, description))')
    .eq('venue_id', venue.id)
    .eq('visible', true)
    .order('position')

  type RawItem = NonNullable<typeof categories>[number]['menu_items'][number]
  type Translation = { locale: string; name: string; description: string | null }

  const sortedCategories = (categories ?? []).map((cat) => ({
    ...cat,
    menu_items: [...(cat.menu_items ?? [])]
      .filter((item: RawItem) => (item as RawItem & { visible?: boolean }).visible !== false)
      .sort((a: RawItem, b: RawItem) => a.position - b.position)
      .map((item: RawItem) => {
        const translations = (item as RawItem & { item_translations?: Translation[] }).item_translations ?? []
        const translation = translations.find((t: Translation) => t.locale === locale)
        return {
          ...item,
          displayName: translation?.name ?? item.name,
          displayDescription: translation?.description ?? item.description,
        }
      }),
  }))

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--mist)' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'var(--teal-deep)' }} className="text-white">
        {venue.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={venue.cover_url} alt="" className="w-full h-40 object-cover opacity-60" />
        )}
        <div className="max-w-2xl mx-auto px-4 py-6">
          {venue.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={venue.logo_url} alt={venue.name} className="w-16 h-16 rounded-xl mb-3 object-cover" />
          )}
          <h1 className="text-2xl font-bold">{venue.name}</h1>
          {venue.description && <p className="text-sm mt-1 opacity-80">{venue.description}</p>}
          <div className="flex gap-4 mt-2 text-sm opacity-70">
            {venue.address && <span>📍 {venue.address}</span>}
            {venue.phone && <span>📞 {venue.phone}</span>}
          </div>
        </div>
      </div>

      {/* Language switcher */}
      {SUPPORTED_LOCALES.length > 1 && (
        <div className="max-w-2xl mx-auto px-4 py-3 flex gap-2 flex-wrap">
          {SUPPORTED_LOCALES.map((l) => (
            <a
              key={l}
              href={`?lang=${l}`}
              className="text-xs px-3 py-1 rounded-full uppercase font-medium border"
              style={{
                backgroundColor: l === locale ? 'var(--teal-primary)' : 'white',
                color: l === locale ? 'white' : 'var(--stone)',
                borderColor: l === locale ? 'var(--teal-primary)' : 'var(--teal-soft)',
              }}
            >
              {l}
            </a>
          ))}
        </div>
      )}

      {/* Menu */}
      <div className="max-w-2xl mx-auto px-4 pb-16">
        {sortedCategories.map((category) => (
          <section key={category.id} className="mb-10">
            <h2 className="text-lg font-bold mb-4 pt-2" style={{ color: 'var(--ink)' }}>{category.name}</h2>
            <div className="space-y-3">
              {category.menu_items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 flex gap-4 border"
                  style={{
                    borderColor: 'var(--teal-soft)',
                    opacity: item.unavailable ? 0.5 : 1,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>{item.displayName}</h3>
                      {item.is_new && (
                        <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: 'var(--amber-accent)', color: 'white' }}>New</span>
                      )}
                      {item.unavailable && (
                        <span className="text-xs px-1.5 py-0.5 rounded font-medium bg-gray-100" style={{ color: 'var(--stone)' }}>Unavailable</span>
                      )}
                    </div>
                    {item.displayDescription && (
                      <p className="text-xs mt-1" style={{ color: 'var(--stone)' }}>{item.displayDescription}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      {item.old_price && (
                        <span className="text-xs line-through" style={{ color: 'var(--stone)' }}>
                          ${item.old_price.toFixed(2)}
                        </span>
                      )}
                      {item.price !== null && (
                        <span className="font-bold text-sm" style={{ color: 'var(--teal-deep)' }}>
                          ${item.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  {item.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image_url}
                      alt={item.displayName}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        {sortedCategories.length === 0 && (
          <div className="text-center py-20" style={{ color: 'var(--stone)' }}>
            <p className="text-4xl mb-3">🍽️</p>
            <p>Menu coming soon</p>
          </div>
        )}

        {venue.wifi_password && (
          <div className="rounded-2xl p-4 mt-8 text-center" style={{ backgroundColor: 'var(--teal-tint)' }}>
            <p className="text-sm font-medium" style={{ color: 'var(--teal-deep)' }}>
              Wi-Fi password: <code>{venue.wifi_password}</code>
            </p>
          </div>
        )}
      </div>

      <footer className="text-center py-6 text-xs" style={{ color: 'var(--stone)' }}>
        Powered by <a href="/" style={{ color: 'var(--teal-primary)' }}>Nuvomenu</a>
      </footer>
    </div>
  )
}
