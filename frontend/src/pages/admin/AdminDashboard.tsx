import { Navbar } from '@/components/layout/Navbar'
import { useCurrentUser } from '@/store/authStore'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/common/Button'
import { Users, Building2, Calendar, BarChart2, LogOut } from 'lucide-react'

/**
 * Admin dashboard shell — full implementation in Phase 12.
 */
export default function AdminDashboard() {
  const user       = useCurrentUser()
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="page-container py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome, {user?.name}. Manage the Tuza MediConnect platform.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users,     label: 'Total Users',      value: '—', color: 'bg-primary-50 text-primary-700' },
            { icon: Building2, label: 'Facilities',        value: '—', color: 'bg-teal-50 text-teal-700'      },
            { icon: Calendar,  label: 'Appointments',      value: '—', color: 'bg-purple-50 text-purple-700'  },
            { icon: BarChart2, label: 'Platform Activity', value: '—', color: 'bg-orange-50 text-orange-700'  },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon size={18} />
                </div>
                <span className="text-xs font-medium text-gray-500">{label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="card p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Full Dashboard — Phase 12</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            User management, facility oversight, audit logs, and platform statistics will be built in Phase 12.
          </p>
          <Button variant="outline" size="sm" leftIcon={<LogOut size={15} />} onClick={logout}>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )
}
