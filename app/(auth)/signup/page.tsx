import type { Metadata } from 'next'
import { SignupForm } from './SignupForm'

export const metadata: Metadata = { title: 'Create account' }

export default function SignupPage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--ink)' }}>Create your account</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--stone)' }}>
        Already have an account?{' '}
        <a href="/login" style={{ color: 'var(--teal-primary)' }}>Log in</a>
      </p>
      <SignupForm />
    </>
  )
}
