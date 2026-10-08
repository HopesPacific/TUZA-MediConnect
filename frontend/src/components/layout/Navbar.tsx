import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react'
import { clsx } from 'clsx'
import { useAuthStore, useCurrentUser, useIsAuthenticated } from '@/store/authStore'
import { authApi } from '@/api/auth'
import toast from 'react-hot-toast'

interface NavbarProps {
  transparent?: boolean
}

export function Navbar({ transparent }: NavbarProps) {
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [profileOpen,  setProfileOpen]  = useState(false)
  const isAuthenticated = useIsAuthenticated()
  const user            = useCurrentUser()
  const clearAuth       = useAuthStore(s => s.clearAuth)
  const navigate        = useNavigate()

  const handleLogout = async () => {
    try { await authApi.logout() } catch {}
    clearAuth()
    toast.success('Logged out successfully.')
    navigate('/login')
  }

  const dashboardLink = user ? {
    patient:        '/patient/dashboard',
    facility_staff: '/facility/dashboard',
    administrator:  '/admin/dashboard',
  }[user.role] : '/'

  return (
    <nav className={clsx(
      'sticky top-0 z-40 border-b',
      transparent
        ? 'bg-white/80 backdrop-blur-md border-gray-100'
        : 'bg-white border-gray-200'
    )}>
      <div className="page-container">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900">
              Tuza <span className="text-primary-600">MediConnect</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/facilities" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
              Find a Facility
            </Link>
            <Link to="/services" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
              Services
            </Link>
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(v => !v)}
                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 text-sm font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-800 leading-none">{user.name.split(' ')[0]}</p>
                      <p className="text-xs text-gray-400 capitalize">{user.role.replace('_', ' ')}</p>
                    </div>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>

                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-card-lg border border-gray-100 py-1 z-20">
                        <Link to={dashboardLink ?? '/'}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <User size={15} className="text-gray-400" /> Dashboard
                        </Link>
                        <Link to="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <Settings size={15} className="text-gray-400" /> Settings
                        </Link>
                        <hr className="my-1 border-gray-100" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                          <LogOut size={15} /> Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-primary-600 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                  Sign in
                </Link>
                <Link to="/register"
                  className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-xl transition-colors">
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          <Link to="/facilities" onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
            Find a Facility
          </Link>
          <Link to="/services" onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
            Services
          </Link>
          <hr className="my-2 border-gray-100" />
          {isAuthenticated ? (
            <>
              <Link to={dashboardLink ?? '/'} onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                Dashboard
              </Link>
              <button onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg">
                Sign in
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg text-center">
                Get started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
