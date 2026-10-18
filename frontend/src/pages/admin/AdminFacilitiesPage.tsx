import { useState, useEffect, useCallback } from 'react'
import { Search, CheckCircle, XCircle, Building2, Power } from 'lucide-react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Badge } from '@/components/common/Badge'
import { Spinner } from '@/components/common/Spinner'
import { EmptyState } from '@/components/common/EmptyState'
import { adminApi } from '@/api/admin'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'

export default function AdminFacilitiesPage() {
  const [facilities, setFacilities] = useState<any[]>([])
  const [isLoading,  setIsLoading]  = useState(true)
  const [search,     setSearch]     = useState('')
  const [actionId,   setActionId]   = useState<number | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const res     = await adminApi.getFacilities({ search: search || undefined })
      const payload = res.data.data as any
      setFacilities(Array.isArray(payload) ? payload : payload.data ?? [])
    } catch { setFacilities([]) }
    finally { setIsLoading(false) }
  }, [search])

  useEffect(() => { load() }, [load])

  const handleVerify = async (f: any) => {
    setActionId(f.id)
    try {
      await adminApi.verifyFacility(f.id)
      toast.success(`Facility ${f.is_verified ? 'unverified' : 'verified'}.`)
      load()
    } catch { toast.error('Action failed.') }
    finally { setActionId(null) }
  }

  const handleToggle = async (f: any) => {
    setActionId(f.id)
    try {
      await adminApi.toggleFacilityActive(f.id)
      toast.success(`Facility ${f.is_active ? 'deactivated' : 'activated'}.`)
      load()
    } catch { toast.error('Action failed.') }
    finally { setActionId(null) }
  }

  const typeLabels: Record<string, string> = {
    hospital: 'Hospital', clinic: 'Clinic', pharmacy: 'Pharmacy',
    laboratory: 'Lab', dental: 'Dental', eye_care: 'Eye Care',
    mental_health: 'Mental Health', maternity: 'Maternity', other: 'Other',
  }

  return (
    <AdminLayout title="Facility Management" subtitle="Manage and verify healthcare facilities.">
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name or location…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : facilities.length === 0 ? (
        <div className="card"><EmptyState icon={<Building2 size={24} />} title="No facilities found" /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Facility</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Location</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {facilities.map((f: any) => (
                  <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{f.name}</p>
                      <p className="text-xs text-gray-400">{f.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color="teal">{typeLabels[f.type] ?? f.type}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{f.location}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <Badge color={f.is_active ? 'green' : 'red'}>{f.is_active ? 'Active' : 'Inactive'}</Badge>
                        <Badge color={f.is_verified ? 'blue' : 'gray'}>{f.is_verified ? 'Verified' : 'Unverified'}</Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVerify(f)}
                          disabled={actionId === f.id}
                          className={clsx(
                            'flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50',
                            f.is_verified
                              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              : 'bg-blue-50 text-blue-600 hover:bg-blue-100',
                          )}>
                          {f.is_verified ? <XCircle size={12} /> : <CheckCircle size={12} />}
                          {f.is_verified ? 'Unverify' : 'Verify'}
                        </button>
                        <button
                          onClick={() => handleToggle(f)}
                          disabled={actionId === f.id}
                          className={clsx(
                            'flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50',
                            f.is_active
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-green-50 text-green-600 hover:bg-green-100',
                          )}>
                          <Power size={12} />
                          {f.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
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
