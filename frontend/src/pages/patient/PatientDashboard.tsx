import { useCurrentUser } from '@/store/authStore'

/**
 * Patient dashboard — built fully in Phase 4 (Patient Module).
 */
export default function PatientDashboard() {
  const user = useCurrentUser()
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="card p-8 w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Patient Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome, {user?.name ?? 'Patient'}</p>
        <p className="text-gray-400 text-xs mt-4">Full dashboard — built in Phase 4</p>
      </div>
    </div>
  )
}
