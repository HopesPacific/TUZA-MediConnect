import { useState, useEffect } from 'react'
import { Users, Building2, Calendar, CheckCircle, Clock, TrendingUp, CreditCard, AlertCircle } from 'lucide-react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { StatCard } from '@/components/common/StatCard'
import { Spinner } from '@/components/common/Spinner'
import { Badge } from '@/components/common/Badge'
import { adminApi, type AdminDashboardData } from '@/api/admin'
import { formatCurrency, timeAgo } from '@/utils/formatters'
import { clsx } from 'clsx'

export default function AdminDashboard() {
  const [data,      setData]      = useState<AdminDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    adminApi.getDashboard()
      .then(r => setData(r.data.data))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return (
    <AdminLayout>
      <div className="flex justify-center py-24"><Spinner size="lg" /></div>
    </AdminLayout>
  )

  if (!data) return (
    <AdminLayout title="Admin Dashboard">
      <p className="text-gray-500">Failed to load dashboard data.</p>
    </AdminLayout>
  )

  const { stats, monthly_chart, recent_activity, recent_users } = data

  return (
    <AdminLayout title="Platform Overview" subtitle="Tuza MediConnect — Admin Dashboard">

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Users"       value={stats.users.total}                    icon={<Users size={18} />}       color="blue"   />
        <StatCard label="Patients"          value={stats.users.patients}                 icon={<Users size={18} />}       color="teal"   />
        <StatCard label="Facilities"        value={stats.facilities.total}               icon={<Building2 size={18} />}   color="purple" />
        <StatCard label="Verified"          value={stats.facilities.verified}            icon={<CheckCircle size={18} />} color="green"  />
        <StatCard label="Total Appts"       value={stats.appointments.total}             icon={<Calendar size={18} />}    color="blue"   />
        <StatCard label="Pending"           value={stats.appointments.pending}           icon={<Clock size={18} />}       color="yellow" />
        <StatCard label="Completed"         value={stats.appointments.completed}         icon={<CheckCircle size={18} />} color="green"  />
        <StatCard label="Completion Rate"   value={`${stats.appointments.completion_rate}%`} icon={<TrendingUp size={18} />}  color="teal"  />
      </div>

      {/* Revenue + monthly chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Revenue card */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CreditCard size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Revenue (Mock)</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(stats.payments.total_revenue, stats.payments.currency)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <AlertCircle size={14} className="text-orange-400" />
            <p className="text-xs text-gray-500">Mock payments — no real transactions</p>
          </div>
        </div>

        {/* Monthly appointments chart (simple bar) */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold text-gray-900 text-sm mb-4">Monthly Appointments (Last 6 Months)</h3>
          <div className="flex items-end justify-between gap-2 h-24">
            {monthly_chart.map(m => {
              const maxVal = Math.max(...monthly_chart.map(x => x.appointments), 1)
              const pct    = Math.round((m.appointments / maxVal) * 100)
              const cpct   = Math.round((m.completed    / maxVal) * 100)
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col justify-end h-16 gap-0.5">
                    <div className="w-full bg-primary-500 rounded-t"
                      style={{ height: `${pct}%` }}
                      title={`${m.appointments} total`}
                    />
                    <div className="w-full bg-green-400 rounded-t"
                      style={{ height: `${cpct}%` }}
                      title={`${m.completed} completed`}
                    />
                  </div>
                  <p className="text-xs text-gray-400 text-center leading-tight">{m.month.split(' ')[0]}</p>
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-100">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-3 h-3 bg-primary-500 rounded" /> Total
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-3 h-3 bg-green-400 rounded" /> Completed
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent activity */}
        <div className="card">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {recent_activity.length === 0 ? (
              <p className="px-5 py-4 text-sm text-gray-400">No activity yet.</p>
            ) : recent_activity.map((log, i) => (
              <div key={i} className="px-5 py-3 flex items-start gap-3">
                <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-gray-500">{log.user.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900">{log.description ?? log.action}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {log.user} · {timeAgo(log.created_at)}
                  </p>
                </div>
                <Badge color="gray" className="flex-shrink-0 text-xs">{log.action}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recent users */}
        <div className="card">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">Recent Registrations</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {recent_users.length === 0 ? (
              <p className="px-5 py-4 text-sm text-gray-400">No users yet.</p>
            ) : recent_users.map(u => (
              <div key={u.id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-700 text-xs font-semibold">{u.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <Badge color={u.role === 'patient' ? 'blue' : u.role === 'administrator' ? 'red' : 'teal'}>
                    {u.role.replace('_', ' ')}
                  </Badge>
                  <p className="text-xs text-gray-400 mt-0.5">{timeAgo(u.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
