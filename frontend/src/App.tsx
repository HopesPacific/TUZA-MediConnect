import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { GuestRoute } from '@/routes/GuestRoute'

// Public pages
import LandingPage from '@/pages/public/LandingPage'

// Auth pages
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'

// Patient pages
import PatientDashboard from '@/pages/patient/PatientDashboard'

// Facility pages
import FacilityDashboard from '@/pages/facility/FacilityDashboard'

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard'

// Shared
import NotFoundPage from '@/pages/NotFoundPage'

/**
 * Application route tree.
 * New routes are added here as each phase is built.
 *
 * Route groups:
 *  /                → Public landing page
 *  /login           → Guest only
 *  /register        → Guest only
 *  /patient/*       → Authenticated patients only
 *  /facility/*      → Authenticated facility staff only
 *  /admin/*         → Authenticated admins only
 */
export default function App() {
  return (
    <Routes>
      {/* ── Public ────────────────────────────────────────────────────── */}
      <Route path="/" element={<LandingPage />} />

      {/* ── Auth (guests only) ────────────────────────────────────────── */}
      <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* ── Patient ───────────────────────────────────────────────────── */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      {/* ── Facility Staff ────────────────────────────────────────────── */}
      <Route
        path="/facility/dashboard"
        element={
          <ProtectedRoute allowedRoles={['facility_staff']}>
            <FacilityDashboard />
          </ProtectedRoute>
        }
      />

      {/* ── Admin ─────────────────────────────────────────────────────── */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['administrator']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ── Fallback ──────────────────────────────────────────────────── */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*"    element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
