import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { LogoutButton } from './LogoutButton'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 flex-shrink-0 flex flex-col border-r" style={{ backgroundColor: 'white', borderColor: 'var(--teal-soft)' }}>
        <div className="h-16 flex items-center px-6 border-b" style={{ borderColor: 'var(--teal-soft)' }}>
          <Link href="/venues" className="font-bold text-lg" style={{ color: 'var(--teal-deep)' }}>
            Nuvomenu
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/venues"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--teal-tint)]"
            style={{ color: 'var(--ink)' }}
          >
            <span>🏠</span> Venues
          </Link>
          <Link
            href="/account"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--teal-tint)]"
            style={{ color: 'var(--ink)' }}
          >
            <span>👤</span> Account
          </Link>
        </nav>

        <div className="p-4 border-t" style={{ borderColor: 'var(--teal-soft)' }}>
          <div className="flex items-center gap-3 mb-3">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: 'var(--teal-primary)' }}>
                {(profile?.full_name ?? user.email ?? 'U')[0].toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--ink)' }}>{profile?.full_name ?? 'User'}</p>
              <p className="text-xs truncate" style={{ color: 'var(--stone)' }}>{user.email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-auto" style={{ backgroundColor: 'var(--mist)' }}>
        {children}
      </main>
    </div>
  )
}
