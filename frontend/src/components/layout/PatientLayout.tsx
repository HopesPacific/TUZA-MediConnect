import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Calendar, Search, User, Bell, Menu, X, LogOut } from 'lucide-react'
import { clsx } from 'clsx'
import { PatientSidebar } from './PatientSidebar'
import { useAuth } from '@/hooks/useAuth'

interface PatientLayoutProps {
  children:  React.ReactNode
  title?:    string
  subtitle?: string
}

const mobileNav = [
  { to: '/patient/dashboard',    icon: LayoutDashboard, label: 'Home'     },
  { to: '/patient/appointments', icon: Calendar,        label: 'Bookings' },
  { to: '/patient/facilities',   icon: Search,          label: 'Find'     },
  { to: '/patient/profile',      icon: User,            label: 'Profile'  },
]

export function PatientLayout({ children, title, subtitle }: PatientLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <PatientSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-bold text-sm text-gray-900">Tuza MediConnect</span>
          </div>
          <div className="flex items-center gap-2">
            <NavLink to="/patient/notifications" className="p-1.5 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </NavLink>
            <button onClick={() => setMobileMenuOpen(v => !v)} className="p-1.5 text-gray-500">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Mobile slide menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl p-5 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold text-gray-900">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)}><X size={18} /></button>
              </div>
              <nav className="flex-1 space-y-0.5">
                {[
                  { to: '/patient/dashboard',     icon: LayoutDashboard, label: 'Dashboard'    },
                  { to: '/patient/appointments',  icon: Calendar,        label: 'Appointments' },
                  { to: '/patient/facilities',    icon: Search,          label: 'Find Facilities' },
                  { to: '/patient/profile',       icon: User,            label: 'My Profile'   },
                ].map(({ to, icon: Icon, label }) => (
                  <NavLink key={to} to={to} onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => clsx(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                      isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50',
                    )}
                  >
                    <Icon size={18} /> {label}
                  </NavLink>
                ))}
              </nav>
              <button onClick={logout}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                <LogOut size={18} /> Sign out
              </button>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 max-w-6xl w-full mx-auto">
          {(title || subtitle) && (
            <div className="mb-6">
              {title    && <h1 className="text-xl font-bold text-gray-900">{title}</h1>}
              {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
          )}
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30">
          <div className="grid grid-cols-4">
            {mobileNav.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) => clsx(
                  'flex flex-col items-center gap-0.5 py-3 text-xs font-medium transition-colors',
                  isActive ? 'text-primary-600' : 'text-gray-400',
                )}
              >
                <Icon size={20} />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
