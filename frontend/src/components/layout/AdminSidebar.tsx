import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Calendar, Users, Building2, FileText, LogOut } from 'lucide-react'
import { clsx } from 'clsx'
import { useAuth } from '@/hooks/useAuth'
import { useCurrentUser } from '@/store/authStore'

const navItems = [
  { to: '/admin/dashboard',    icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/admin/users',        icon: Users,           label: 'Users'        },
  { to: '/admin/facilities',   icon: Building2,       label: 'Facilities'   },
  { to: '/admin/appointments', icon: Calendar,        label: 'Appointments' },
  { to: '/admin/audit-logs',   icon: FileText,        label: 'Audit Logs'   },
]

export function AdminSidebar() {
  const user       = useCurrentUser()
  const { logout } = useAuth()

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-gray-900 text-gray-300 py-6">
      <div className="px-5 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="font-bold text-sm text-white">Tuza <span className="text-primary-400">Admin</span></span>
        </div>
      </div>

      <div className="px-5 mb-6">
        <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl">
          <div className="w-8 h-8 bg-primary-700 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{user?.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name.split(' ')[0]}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary-700 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white',
            )}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 mt-4">
        <button onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-gray-400 hover:bg-red-900/40 hover:text-red-400 transition-colors">
          <LogOut size={18} /> Sign out
        </button>
      </div>
    </aside>
  )
}
