'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <div className="text-center py-4">
        <div className="text-4xl mb-4">✉️</div>
        <h2 className="font-semibold text-lg mb-2" style={{ color: 'var(--ink)' }}>Check your email</h2>
        <p className="text-sm" style={{ color: 'var(--stone)' }}>
          We sent a confirmation link to <strong>{email}</strong>.
          Click it to activate your account.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>Full name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
          style={{ borderColor: 'var(--teal-soft)' }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
          style={{ borderColor: 'var(--teal-soft)' }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
          style={{ borderColor: 'var(--teal-soft)' }}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-lg text-white font-medium text-sm disabled:opacity-50"
        style={{ backgroundColor: 'var(--teal-primary)' }}
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>
      <p className="text-xs text-center" style={{ color: 'var(--stone)' }}>
        By signing up you agree to our Terms of Service and Privacy Policy.
        Your 30-day free trial starts immediately.
      </p>
    </form>
  )
}
