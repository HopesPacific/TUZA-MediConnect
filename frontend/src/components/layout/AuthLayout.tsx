import { Link } from 'react-router-dom'

interface AuthLayoutProps {
  children:    React.ReactNode
  title:       string
  subtitle?:   string
  /** Show the opposite auth link — "Already have an account?" etc */
  footer?:     React.ReactNode
}

/**
 * Shared layout for Login and Register pages.
 * Left panel: branding + feature highlights
 * Right panel: the form
 */
export function AuthLayout({ children, title, subtitle, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* ── Left — Brand panel (hidden on mobile) ─────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary-700 via-primary-600 to-teal-600 p-12 text-white">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="text-lg font-bold">Tuza MediConnect</span>
        </Link>

        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold leading-snug mb-4">
              Healthcare at your fingertips
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Connect with top healthcare facilities, book appointments, and manage your health — all in one place.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: '🏥', text: 'Browse verified healthcare facilities'     },
              { icon: '📅', text: 'Book appointments in under 2 minutes'     },
              { icon: '🔔', text: 'Real-time appointment status updates'      },
              { icon: '💬', text: 'Direct messaging with your care team'      },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-white/90">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/50 text-sm">
          © {new Date().getFullYear()} Tuza MediConnect. All rights reserved.
        </p>
      </div>

      {/* ── Right — Form panel ────────────────────────────────────────────── */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-white overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="font-bold text-primary-700">Tuza MediConnect</span>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="mt-2 text-gray-500 text-sm">{subtitle}</p>}
          </div>

          {children}

          {footer && (
            <div className="mt-6 text-center text-sm text-gray-600">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
