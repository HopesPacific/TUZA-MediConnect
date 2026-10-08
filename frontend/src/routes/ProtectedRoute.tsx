import { Navigate, useLocation } from 'react-router-dom'
import { useIsAuthenticated, useUserRole } from '@/store/authStore'
import type { UserRole } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  /** If provided, only users with this role can access the route */
  allowedRoles?: UserRole[]
}

/**
 * Wraps a route to require authentication.
 * Optionally restricts access by role.
 *
 * If not authenticated → redirect to /login (preserving the intended URL)
 * If authenticated but wrong role → redirect to their dashboard
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const isAuthenticated = useIsAuthenticated()
  const role = useUserRole()
  const location = useLocation()

  if (!isAuthenticated) {
    // Pass the current location so after login we can send them back here
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Authenticated but wrong role — redirect to their own dashboard
    const dashboardMap: Record<UserRole, string> = {
      patient:        '/patient/dashboard',
      facility_staff: '/facility/dashboard',
      administrator:  '/admin/dashboard',
    }
    return <Navigate to={dashboardMap[role]} replace />
  }

  return <>{children}</>
}
