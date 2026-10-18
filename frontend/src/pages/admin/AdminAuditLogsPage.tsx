import { useState, useEffect, useCallback } from 'react'
import { FileText, Shield } from 'lucide-react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Badge } from '@/components/common/Badge'
import { Spinner } from '@/components/common/Spinner'
import { EmptyState } from '@/components/common/EmptyState'
import { adminApi, type AuditLogEntry } from '@/api/admin'
import { timeAgo } from '@/utils/formatters'
import { clsx } from 'clsx'

const actionColors: Record<string, 'green' | 'yellow' | 'red' | 'blue' | 'gray'> = {
  login:            'green',
  logout:           'gray',
  registered:       'blue',
  created:          'green',
  updated:          'yellow',
  deleted:          'red',
  password_changed: 'yellow',
}

export default function AdminAuditLogsPage() {
  const [logs,      setLogs]      = useState<AuditLogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter,    setFilter]    = useState('')

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const res     = await adminApi.getAuditLogs({ action: filter || undefined })
      const payload = res.data.data as any
      setLogs(Array.isArray(payload) ? payload : payload.data ?? [])
    } catch { setLogs([]) }
    finally { setIsLoading(false) }
  }, [filter])

  useEffect(() => { load() }, [load])

  return (
    <AdminLayout title="Audit Logs" subtitle="Platform activity and security events.">
      {/* Filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {['', 'login', 'logout', 'registered', 'created', 'updated', 'deleted', 'password_changed'].map(a => (
          <button key={a} onClick={() => setFilter(a)}
            className={clsx('px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
              filter === a ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300')}>
            {a || 'All'}
          </button>
        ))}
      </div>

      {/* Security note */}
      <div className="flex items-center gap-2 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
        <Shield size={15} className="text-yellow-600 flex-shrink-0" />
        <p className="text-xs text-yellow-700">Audit logs are append-only and cannot be modified or deleted.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : logs.length === 0 ? (
        <div className="card"><EmptyState icon={<FileText size={24} />} title="No audit logs found" /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Action</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Description</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">User</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">IP Address</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Badge color={actionColors[log.action] ?? 'gray'}>{log.action}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs">
                      <p className="truncate">{log.description ?? `${log.action} on ${log.model_type || 'record'}`}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{log.user?.name ?? 'System'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs font-mono">{log.ip_address ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{timeAgo(log.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
