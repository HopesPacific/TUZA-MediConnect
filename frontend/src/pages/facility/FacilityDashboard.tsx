import { Calendar, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'
import { FacilityLayout } from '@/components/layout/FacilityLayout'
import { StatCard } from '@/components/common/StatCard'
import { FacilityAppointmentCard } from '@/components/appointments/FacilityAppointmentCard'
import { EmptyState } from '@/components/common/EmptyState'
import { Spinner } from '@/components/common/Spinner'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { useFacilityDashboard, useFacilityAppointmentActions } from '@/hooks/useFacilityDashboard'
import { formatDate } from '@/utils/formatters'

export default function FacilityDashboard() {
  const { data, isLoading, error, refetch } = useFacilityDashboard()
  const actions = useFacilityAppointmentActions(refetch)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  if (isLoading) {
    return (
      <FacilityLayout>
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <Spinner size="lg" className="mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading dashboard…</p>
          </div>
        </div>
      </FacilityLayout>
    )
  }

  if (error || !data) {
    return (
      <FacilityLayout>
        <Alert variant="error" className="mb-4">{error ?? 'Something went wrong.'}</Alert>
        <Button variant="outline" onClick={refetch}>Retry</Button>
      </FacilityLayout>
    )
  }

  return (
    <FacilityLayout
      title={`${greeting}, ${data.staff.name.split(' ')[0]} 👋`}
      subtitle={`${data.facility.name} · ${data.facility.location}`}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <StatCard label="Today's Appointments" value={data.stats.today_total}      icon={<Calendar size={18}    />} color="blue"   />
        <StatCard label="Pending Requests"      value={data.stats.pending_requests} icon={<AlertCircle size={18} />} color="yellow" />
        <StatCard label="Confirmed Today"       value={data.stats.today_confirmed}  icon={<Clock size={18}       />} color="teal"   />
        <StatCard label="Completed Today"       value={data.stats.today_completed}  icon={<CheckCircle size={18} />} color="green"  />
        <StatCard label="This Month"            value={data.stats.total_this_month} icon={<TrendingUp size={18}  />} color="purple" />
        <StatCard label="Total Completed"       value={data.stats.completed_total}  icon={<CheckCircle size={18} />} color="green"  />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Today's appointments */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">
              Today — {formatDate(new Date().toISOString().split('T')[0])}
            </h2>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {data.today_appointments.length} appointments
            </span>
          </div>

          {data.today_appointments.length === 0 ? (
            <div className="card">
              <EmptyState icon={<Calendar size={22} />} title="No appointments today" description="Your schedule is clear for today." />
            </div>
          ) : (
            <div className="space-y-3">
              {data.today_appointments.map(appt => (
                <FacilityAppointmentCard
                  key={appt.id}
                  appointment={appt}
                  loadingId={actions.loadingId}
                  onConfirm={actions.confirm}
                  onReject={actions.reject}
                  onReschedule={actions.reschedule}
                  onComplete={actions.complete}
                />
              ))}
            </div>
          )}
        </section>

        {/* Upcoming confirmed */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Upcoming (Next 7 Days)</h2>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
              {data.upcoming_confirmed.length} confirmed
            </span>
          </div>

          {data.upcoming_confirmed.length === 0 ? (
            <div className="card">
              <EmptyState icon={<Calendar size={22} />} title="No upcoming confirmed appointments" description="Confirmed appointments for the next 7 days will appear here." />
            </div>
          ) : (
            <div className="space-y-3">
              {data.upcoming_confirmed.map(appt => (
                <FacilityAppointmentCard
                  key={appt.id}
                  appointment={appt}
                  loadingId={actions.loadingId}
                  onConfirm={actions.confirm}
                  onReject={actions.reject}
                  onReschedule={actions.reschedule}
                  onComplete={actions.complete}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </FacilityLayout>
  )
}
