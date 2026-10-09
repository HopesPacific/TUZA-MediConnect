import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Calendar } from 'lucide-react'
import { PatientLayout } from '@/components/layout/PatientLayout'
import { AppointmentCard } from '@/components/appointments/AppointmentCard'
import { EmptyState } from '@/components/common/EmptyState'
import { Spinner } from '@/components/common/Spinner'
import { Button } from '@/components/common/Button'
import { useAppointments } from '@/hooks/useAppointments'
import { clsx } from 'clsx'

const TABS = [
  { label: 'All',         value: ''          },
  { label: 'Upcoming',    value: 'upcoming'  },
  { label: 'Pending',     value: 'pending'   },
  { label: 'Confirmed',   value: 'confirmed' },
  { label: 'Completed',   value: 'completed' },
  { label: 'Cancelled',   value: 'cancelled' },
]

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState('')

  const isUpcoming = activeTab === 'upcoming'
  const statusFilter = (!isUpcoming && activeTab) ? activeTab : undefined

  const { appointments, isLoading, refetch } = useAppointments({
    status:   statusFilter,
    upcoming: isUpcoming || undefined,
  })

  return (
    <PatientLayout
      title="My Appointments"
      subtitle="View and manage all your appointment bookings."
    >
      {/* Header action */}
      <div className="flex items-center justify-between mb-5">
        <div />
        <Link to="/patient/book">
          <Button size="sm" leftIcon={<Plus size={15} />}>Book appointment</Button>
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={clsx(
              'flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              activeTab === tab.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<Calendar size={24} />}
            title="No appointments found"
            description={activeTab
              ? `You have no ${activeTab} appointments.`
              : 'You have not booked any appointments yet.'}
            action={
              <Link to="/patient/book">
                <Button size="sm" leftIcon={<Plus size={14} />}>Book your first appointment</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map(appt => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              onCancelled={refetch}
            />
          ))}
        </div>
      )}
    </PatientLayout>
  )
}
