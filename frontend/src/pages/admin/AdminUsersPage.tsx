import { useState, useEffect, useCallback } from 'react'
import { Search, UserCheck, UserX, Shield } from 'lucide-react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Badge } from '@/components/common/Badge'
import { Spinner } from '@/components/common/Spinner'
import { EmptyState } from '@/components/common/EmptyState'
import { adminApi } from '@/api/admin'
import { formatDate } from '@/utils/formatters'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'

const ROLE_TABS = [
  { label: 'All',       value: ''               },
  { label: 'Patients',  value: 'patient'         },
  { label: 'Staff',     value: 'facility_staff'  },
  { label: 'Admins',    value: 'administrator'   },
]

export default function AdminUsersPage() {
  const [users,     setUsers]     = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [role,      setRole]      = useState('')
  const [search,    setSearch]    = useState('')
  const [toggling,  setToggling]  = useState<number | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const res     = await adminApi.getUsers({ role: role || undefined, search: search || undefined })
      const payload = res.data.data as any
      setUsers(Array.isArray(payload) ? payload : payload.data ?? [])
    } catch { setUsers([]) }
    finally { setIsLoading(false) }
  }, [role, search])

  useEffect(() => { load() }, [load])

  const handleToggle = async (user: any) => {
    setToggling(user.id)
    try {
      await adminApi.toggleUserActive(user.id)
      toast.success(`Account ${user.is_active ? 'deactivated' : 'activated'}.`)
      load()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to update account.')
    } finally {
      setToggling(null)
    }
  }

  const roleBadge = (r: string) => {
    const map: Record<string, 'blue' | 'teal' | 'red' | 'gray'> = {
      patient: 'blue', facility_staff: 'teal', administrator: 'red',
    }
    return <Badge color={map[r] ?? 'gray'}>{r.replace('_', ' ')}</Badge>
  }

  return (
    <AdminLayout title="User Management" subtitle="Manage all registered users on the platform.">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search name, email, or phone…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
      </div>

      {/* Role tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 overflow-x-auto">
        {ROLE_TABS.map(t => (
          <button key={t.value} onClick={() => setRole(t.value)}
            className={clsx('flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              role === t.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : users.length === 0 ? (
        <div className="card"><EmptyState icon={<Shield size={24} />} title="No users found" /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">User</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Phone</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Joined</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-700 text-xs font-semibold">{u.name?.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{roleBadge(u.role)}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{u.phone}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(u.created_at)}</td>
                    <td className="px-4 py-3">
                      <Badge color={u.is_active ? 'green' : 'red'}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(u)}
                        disabled={toggling === u.id}
                        className={clsx(
                          'flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50',
                          u.is_active
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100',
                        )}
                      >
                        {u.is_active ? <UserX size={13} /> : <UserCheck size={13} />}
                        {u.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
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
