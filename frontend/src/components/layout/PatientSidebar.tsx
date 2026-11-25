import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Calendar, Search, User, Bell, MessageSquare, Stethoscope, LogOut } from 'lucide-react'
import { clsx } from 'clsx'
import { useAuth } from '@/hooks/useAuth'
import { useCurrentUser } from '@/store/authStore'

const navItems = [
  { to: '/patient/dashboard',     icon: LayoutDashboard, label: 'Dashboard'       },
  { to: '/patient/appointments',  icon: Calendar,        label: 'Appointments'    },
  { to: '/patient/facilities',    icon: Search,          label: 'Find Facilities' },
  { to: '/patient/services',      icon: Stethoscope,     label: 'Services'        },
  { to: '/patient/notifications', icon: Bell,            label: 'Notifications'   },
  { to: '/patient/messages',      icon: MessageSquare,   label: 'Messages'        },
  { to: '/patient/profile',       icon: User,            label: 'My Profile'      },
]

export function PatientSidebar() {
  const user       = useCurrentUser()
  const { logout } = useAuth()

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-white border-r border-gray-100 py-6">
      <div className="px-5 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="font-bold text-sm text-gray-900">Tuza <span className="text-primary-600">Medi</span></span>
        </div>
      </div>

      <div className="px-5 mb-6">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary-700 text-sm font-semibold">
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name.split(' ')[0]}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            )}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 mt-4">
        <button onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
