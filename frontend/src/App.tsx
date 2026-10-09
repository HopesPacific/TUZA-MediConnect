import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { GuestRoute } from '@/routes/GuestRoute'

// Public
import LandingPage from '@/pages/public/LandingPage'

// Auth
import LoginPage    from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'

// Patient
import PatientDashboard    from '@/pages/patient/PatientDashboard'
import AppointmentsPage    from '@/pages/patient/AppointmentsPage'
import BookAppointmentPage from '@/pages/patient/BookAppointmentPage'
import FacilitiesPage      from '@/pages/patient/FacilitiesPage'
import ProfilePage         from '@/pages/patient/ProfilePage'

// Facility staff
import FacilityDashboard      from '@/pages/facility/FacilityDashboard'
import FacilityAppointmentsPage from '@/pages/facility/FacilityAppointmentsPage'
import FacilityProfilePage    from '@/pages/facility/FacilityProfilePage'

// Admin
import AdminDashboard from '@/pages/admin/AdminDashboard'

// Shared
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      {/* ── Public ────────────────────────────────────────────────── */}
      <Route path="/" element={<LandingPage />} />

      {/* ── Auth (guests only) ────────────────────────────────────── */}
      <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* ── Patient ───────────────────────────────────────────────── */}
      <Route path="/patient" element={<ProtectedRoute allowedRoles={['patient']} />}>
        <Route path="dashboard"    element={<PatientDashboard />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="book"         element={<BookAppointmentPage />} />
        <Route path="facilities"   element={<FacilitiesPage />} />
        <Route path="profile"      element={<ProfilePage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* ── Facility Staff ────────────────────────────────────────── */}
      <Route path="/facility" element={<ProtectedRoute allowedRoles={['facility_staff']} />}>
        <Route path="dashboard"    element={<FacilityDashboard />} />
        <Route path="appointments" element={<FacilityAppointmentsPage />} />
        <Route path="profile"      element={<FacilityProfilePage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* ── Admin ─────────────────────────────────────────────────── */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['administrator']} />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* ── Fallbacks ─────────────────────────────────────────────── */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*"    element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
