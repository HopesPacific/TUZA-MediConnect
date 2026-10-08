import { Navbar } from '@/components/layout/Navbar'
import { useCurrentUser } from '@/store/authStore'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/common/Button'
import { Calendar, Bell, FileText, LogOut } from 'lucide-react'

/**
 * Patient dashboard shell — full implementation in Phase 4 (Patient Module).
 * Shows nav, welcome message, and quick-action cards.
 */
export default function PatientDashboard() {
  const user       = useCurrentUser()
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="page-container py-8">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Good {getGreeting()}, {user?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's a summary of your health activity.</p>
        </div>

        {/* Quick action cards — fully built in Phase 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Calendar, label: 'Book Appointment', color: 'bg-primary-50 text-primary-700', href: '#' },
            { icon: FileText, label: 'My Appointments',  color: 'bg-teal-50 text-teal-700',      href: '#' },
            { icon: Bell,     label: 'Notifications',    color: 'bg-yellow-50 text-yellow-700',   href: '#' },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="card p-5 flex items-center gap-4 hover:shadow-card-md transition-shadow cursor-pointer">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={22} />
              </div>
              <span className="font-medium text-gray-800 text-sm">{label}</span>
            </div>
          ))}
        </div>

        {/* Coming soon notice */}
        <div className="card p-8 text-center">
          <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar size={28} className="text-primary-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Full Dashboard — Phase 4</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            Your full patient dashboard with appointment history, notifications, and profile management is being built in Phase 4.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" size="sm" leftIcon={<LogOut size={15} />} onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
