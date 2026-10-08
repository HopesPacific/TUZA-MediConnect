import { Navbar } from '@/components/layout/Navbar'
import { useCurrentUser } from '@/store/authStore'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/common/Button'
import { Calendar, Users, CheckCircle, LogOut } from 'lucide-react'

/**
 * Facility staff dashboard shell — full implementation in Phase 5.
 */
export default function FacilityDashboard() {
  const user       = useCurrentUser()
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="page-container py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Staff Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome, {user?.name}. Manage your facility's appointments and patients.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Calendar,    label: "Today's Appointments", value: '—', color: 'bg-blue-50 text-blue-700'   },
            { icon: Users,       label: 'Pending Requests',      value: '—', color: 'bg-yellow-50 text-yellow-700' },
            { icon: CheckCircle, label: 'Completed Today',        value: '—', color: 'bg-green-50 text-green-700'  },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon size={18} />
                </div>
                <span className="text-sm font-medium text-gray-600">{label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="card p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Full Dashboard — Phase 5</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            Full appointment management, patient records, and facility settings will be built in Phase 5.
          </p>
          <Button variant="outline" size="sm" leftIcon={<LogOut size={15} />} onClick={logout}>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )
}
