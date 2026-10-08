import { Navigate } from 'react-router-dom'
import { useIsAuthenticated, useUserRole } from '@/store/authStore'
import type { UserRole } from '@/types'

interface GuestRouteProps {
  children: React.ReactNode
}

/**
 * Routes only accessible when NOT logged in (login, register pages).
 * If the user is already authenticated, redirect them to their dashboard.
 */
export function GuestRoute({ children }: GuestRouteProps) {
  const isAuthenticated = useIsAuthenticated()
  const role = useUserRole()

  if (isAuthenticated && role) {
    const dashboardMap: Record<UserRole, string> = {
      patient:        '/patient/dashboard',
      facility_staff: '/facility/dashboard',
      administrator:  '/admin/dashboard',
    }
    return <Navigate to={dashboardMap[role]} replace />
  }

  return <>{children}</>
}
