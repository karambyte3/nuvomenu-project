import type { Metadata } from 'next'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = { title: 'Log in' }

export default function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--ink)' }}>Welcome back</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--stone)' }}>
        Don&apos;t have an account?{' '}
        <a href="/signup" style={{ color: 'var(--teal-primary)' }}>Sign up free</a>
      </p>
      <LoginForm />
    </>
  )
}
