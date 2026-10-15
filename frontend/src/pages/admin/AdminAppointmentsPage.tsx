import { useState, useEffect, useCallback } from 'react'
import { Calendar, TrendingUp, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { StatCard } from '@/components/common/StatCard'
import { AppointmentStatusBadge } from '@/components/common/Badge'
import { Spinner } from '@/components/common/Spinner'
import { EmptyState } from '@/components/common/EmptyState'
import apiClient from '@/api/client'
import { formatDate, formatTime } from '@/utils/formatters'
import { clsx } from 'clsx'

interface AdminStats {
  total: number; pending: number; confirmed: number; completed: number
  cancelled: number; rejected: number; today: number; this_month: number; completion_rate: number
}

const STATUS_TABS = [
  { label: 'All',        value: ''          },
  { label: 'Pending',    value: 'pending'   },
  { label: 'Confirmed',  value: 'confirmed' },
  { label: 'Completed',  value: 'completed' },
  { label: 'Cancelled',  value: 'cancelled' },
  { label: 'Rejected',   value: 'rejected'  },
]

export default function AdminAppointmentsPage() {
  const [stats,   setStats]   = useState<AdminStats | null>(null)
  const [appts,   setAppts]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab,     setTab]     = useState('')
  const [search,  setSearch]  = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [statsRes, apptsRes] = await Promise.all([
        apiClient.get('/admin/appointments/stats'),
        apiClient.get('/admin/appointments', { params: { status: tab || undefined, search: search || undefined, per_page: 20 } }),
      ])
      setStats(statsRes.data.data)
      const payload = apptsRes.data.data as any
      setAppts(Array.isArray(payload) ? payload : payload.data ?? [])
    } catch { setAppts([]) }
    finally { setLoading(false) }
  }, [tab, search])

  useEffect(() => { load() }, [load])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="page-container py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Appointments — Platform Overview</h1>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <StatCard label="Total"       value={stats.total}           icon={<Calendar size={18} />}     color="blue"   />
            <StatCard label="Pending"     value={stats.pending}         icon={<AlertCircle size={18} />}  color="yellow" />
            <StatCard label="Completed"   value={stats.completed}       icon={<CheckCircle size={18} />}  color="green"  />
            <StatCard label="This Month"  value={stats.this_month}      icon={<TrendingUp size={18} />}   color="purple" />
            <StatCard label="Today"       value={stats.today}           icon={<Clock size={18} />}        color="teal"   />
            <StatCard label="Confirmed"   value={stats.confirmed}       icon={<CheckCircle size={18} />}  color="blue"   />
            <StatCard label="Cancelled"   value={stats.cancelled}       icon={<XCircle size={18} />}      color="red"    />
            <StatCard label="Completion %" value={`${stats.completion_rate}%`} icon={<TrendingUp size={18} />} color="green" />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input type="text" placeholder="Search patient name or email…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 overflow-x-auto">
          {STATUS_TABS.map(t => (
            <button key={t.value} onClick={() => setTab(t.value)}
              className={clsx('flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                tab === t.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : appts.length === 0 ? (
          <div className="card">
            <EmptyState icon={<Calendar size={24} />} title="No appointments found"
              description="Try adjusting your filters." />
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Patient</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Service</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Date & Time</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Facility</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appts.map((a: any) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{a.patient?.name}</p>
                        <p className="text-xs text-gray-400">{a.patient?.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{a.service?.name}</td>
                      <td className="px-4 py-3">
                        <p className="text-gray-900">{formatDate(a.appointment_date)}</p>
                        <p className="text-xs text-gray-400">{formatTime(a.appointment_time)}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{a.facility?.name ?? '—'}</td>
                      <td className="px-4 py-3">
                        <AppointmentStatusBadge status={a.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
