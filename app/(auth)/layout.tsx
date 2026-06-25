export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--mist)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold" style={{ color: 'var(--teal-deep)' }}>
            Nuvomenu
          </a>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-8 border" style={{ borderColor: 'var(--teal-soft)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
