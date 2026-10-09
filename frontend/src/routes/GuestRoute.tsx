import { Navigate, Outlet } from 'react-router-dom'
import { useIsAuthenticated, useUserRole } from '@/store/authStore'
import type { UserRole } from '@/types'

interface GuestRouteProps {
  children?: React.ReactNode
}

export function GuestRoute({ children }: GuestRouteProps) {
  const isAuthenticated = useIsAuthenticated()
  const role            = useUserRole()

  if (isAuthenticated && role) {
    const dashboardMap: Record<UserRole, string> = {
      patient:        '/patient/dashboard',
      facility_staff: '/facility/dashboard',
      administrator:  '/admin/dashboard',
    }
    return <Navigate to={dashboardMap[role]} replace />
  }

  return children ? <>{children}</> : <Outlet />
}
