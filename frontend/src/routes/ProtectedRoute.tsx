import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useIsAuthenticated, useUserRole } from '@/store/authStore'
import type { UserRole } from '@/types'

interface ProtectedRouteProps {
  children?:     React.ReactNode
  allowedRoles?: UserRole[]
}

/**
 * Wraps a route to require authentication.
 * Supports both wrapper usage (<ProtectedRoute><Page/></ProtectedRoute>)
 * and nested route usage (element={<ProtectedRoute allowedRoles={...} />}).
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const isAuthenticated = useIsAuthenticated()
  const role            = useUserRole()
  const location        = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    const dashboardMap: Record<UserRole, string> = {
      patient:        '/patient/dashboard',
      facility_staff: '/facility/dashboard',
      administrator:  '/admin/dashboard',
    }
    return <Navigate to={dashboardMap[role]} replace />
  }

  // Support both children and <Outlet /> for nested routes
  return children ? <>{children}</> : <Outlet />
}
