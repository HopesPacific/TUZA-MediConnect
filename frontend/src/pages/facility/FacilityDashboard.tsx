import { useCurrentUser } from '@/store/authStore'

/**
 * Healthcare facility staff dashboard — built in Phase 5.
 */
export default function FacilityDashboard() {
  const user = useCurrentUser()
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="card p-8 w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Facility Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome, {user?.name ?? 'Staff Member'}</p>
        <p className="text-gray-400 text-xs mt-4">Full dashboard — built in Phase 5</p>
      </div>
    </div>
  )
}
