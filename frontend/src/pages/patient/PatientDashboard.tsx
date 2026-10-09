import { Link } from 'react-router-dom'
import { Calendar, CheckCircle, Clock, Plus } from 'lucide-react'
import { PatientLayout } from '@/components/layout/PatientLayout'
import { StatCard } from '@/components/common/StatCard'
import { AppointmentCard } from '@/components/appointments/AppointmentCard'
import { ProfileCompletionCard } from '@/components/patient/ProfileCompletionCard'
import { EmptyState } from '@/components/common/EmptyState'
import { Spinner } from '@/components/common/Spinner'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { usePatientDashboard } from '@/hooks/usePatientDashboard'

export default function PatientDashboard() {
  const { data, isLoading, error, refetch } = usePatientDashboard()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  if (isLoading) {
    return (
      <PatientLayout>
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <Spinner size="lg" className="mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading your dashboard…</p>
          </div>
        </div>
      </PatientLayout>
    )
  }

  if (error || !data) {
    return (
      <PatientLayout>
        <Alert variant="error" className="mb-4">{error ?? 'Something went wrong.'}</Alert>
        <Button variant="outline" onClick={refetch}>Try again</Button>
      </PatientLayout>
    )
  }

  const firstName = data.user.name.split(' ')[0]

  return (
    <PatientLayout
      title={`${greeting}, ${firstName} 👋`}
      subtitle="Here's a summary of your health activity."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Main column ────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Upcoming"  value={data.stats.upcoming}  icon={<Calendar     size={18} />} color="blue"   />
            <StatCard label="Pending"   value={data.stats.pending}   icon={<Clock        size={18} />} color="yellow" />
            <StatCard label="Completed" value={data.stats.completed} icon={<CheckCircle  size={18} />} color="green"  />
            <StatCard label="Total"     value={data.stats.total}     icon={<Calendar     size={18} />} color="purple" />
          </div>

          {/* Quick book CTA */}
          <div className="bg-gradient-to-r from-primary-600 to-teal-600 rounded-2xl p-5 text-white flex items-center justify-between">
            <div>
              <p className="font-semibold mb-1">Need to see a doctor?</p>
              <p className="text-white/80 text-sm">Book an appointment in under 2 minutes.</p>
            </div>
            <Link to="/patient/book">
              <Button
                size="sm"
                className="bg-white text-primary-700 hover:bg-primary-50 border-0 flex-shrink-0"
                leftIcon={<Plus size={15} />}
              >
                Book now
              </Button>
            </Link>
          </div>

          {/* Upcoming appointments */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">Upcoming Appointments</h2>
              <Link to="/patient/appointments" className="text-xs text-primary-600 hover:underline">
                View all
              </Link>
            </div>

            {data.upcoming_appointments.length === 0 ? (
              <div className="card">
                <EmptyState
                  icon={<Calendar size={24} />}
                  title="No upcoming appointments"
                  description="You have no upcoming appointments. Book one to get started."
                  action={
                    <Link to="/patient/book">
                      <Button size="sm" leftIcon={<Plus size={14} />}>Book appointment</Button>
                    </Link>
                  }
                />
              </div>
            ) : (
              <div className="space-y-3">
                {data.upcoming_appointments.map(appt => (
                  <AppointmentCard
                    key={appt.id}
                    appointment={appt}
                    onCancelled={refetch}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Recent history */}
          {data.recent_history.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-900">Recent History</h2>
                <Link to="/patient/appointments?status=completed" className="text-xs text-primary-600 hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {data.recent_history.map(appt => (
                  <AppointmentCard
                    key={appt.id}
                    appointment={appt}
                    compact
                    onCancelled={refetch}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── Right column ───────────────────────────────────────────────── */}
        <div className="space-y-4">
          <ProfileCompletionCard
            completion={data.profile?.profile_completion ?? 0}
            profile={data.profile}
          />

          {/* Quick links */}
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Quick actions</h3>
            <div className="space-y-1">
              {[
                { label: '+ Book appointment',   to: '/patient/book'          },
                { label: '🏥 Find facilities',    to: '/patient/facilities'    },
                { label: '📋 My appointments',    to: '/patient/appointments'  },
                { label: '👤 Edit profile',       to: '/patient/profile'       },
              ].map(({ label, to }) => (
                <Link key={to} to={to}
                  className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  )
}
