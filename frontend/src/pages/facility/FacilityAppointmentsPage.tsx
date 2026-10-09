import { useState, useEffect, useCallback } from 'react'
import { Search, Calendar } from 'lucide-react'
import { FacilityLayout } from '@/components/layout/FacilityLayout'
import { FacilityAppointmentCard } from '@/components/appointments/FacilityAppointmentCard'
import { EmptyState } from '@/components/common/EmptyState'
import { Spinner } from '@/components/common/Spinner'
import { facilityApi, type FacilityAppointment } from '@/api/facility'
import { useFacilityAppointmentActions } from '@/hooks/useFacilityDashboard'
import { clsx } from 'clsx'

const TABS = [
  { label: 'All',        value: ''          },
  { label: 'Pending',    value: 'pending'   },
  { label: 'Confirmed',  value: 'confirmed' },
  { label: 'Completed',  value: 'completed' },
  { label: 'Rejected',   value: 'rejected'  },
  { label: 'Cancelled',  value: 'cancelled' },
]

export default function FacilityAppointmentsPage() {
  const [appointments, setAppointments] = useState<FacilityAppointment[]>([])
  const [isLoading,    setIsLoading]    = useState(true)
  const [activeTab,    setActiveTab]    = useState('')
  const [search,       setSearch]       = useState('')
  const [dateFilter,   setDateFilter]   = useState('')

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await facilityApi.getAppointments({
        status: activeTab || undefined,
        search: search    || undefined,
        date:   dateFilter || undefined,
        per_page: 20,
      })
      const payload = res.data.data as any
      setAppointments(Array.isArray(payload) ? payload : payload.data ?? [])
    } catch {
      setAppointments([])
    } finally {
      setIsLoading(false)
    }
  }, [activeTab, search, dateFilter])

  useEffect(() => { load() }, [load])

  const actions = useFacilityAppointmentActions(load)

  return (
    <FacilityLayout title="Appointment Management" subtitle="Manage all appointment requests at your facility.">

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search patient name or phone…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
          className="border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white" />
        {dateFilter && (
          <button onClick={() => setDateFilter('')}
            className="px-3 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl">Clear</button>
        )}
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab.value} onClick={() => setActiveTab(tab.value)}
            className={clsx(
              'flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              activeTab === tab.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700',
            )}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : appointments.length === 0 ? (
        <div className="card">
          <EmptyState icon={<Calendar size={24} />} title="No appointments found"
            description="Try adjusting your filters." />
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map(appt => (
            <FacilityAppointmentCard key={appt.id} appointment={appt}
              loadingId={actions.loadingId}
              onConfirm={actions.confirm}
              onReject={actions.reject}
              onReschedule={actions.reschedule}
              onComplete={actions.complete}
            />
          ))}
        </div>
      )}
    </FacilityLayout>
  )
}
