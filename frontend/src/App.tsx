import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { GuestRoute } from '@/routes/GuestRoute'

// Public
import LandingPage  from '@/pages/public/LandingPage'
import ServicesPage from '@/pages/public/ServicesPage'

// Auth
import LoginPage    from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'

// Patient
import PatientDashboard      from '@/pages/patient/PatientDashboard'
import AppointmentsPage      from '@/pages/patient/AppointmentsPage'
import AppointmentDetailPage from '@/pages/patient/AppointmentDetailPage'
import BookAppointmentPage   from '@/pages/patient/BookAppointmentPage'
import FacilitiesPage        from '@/pages/patient/FacilitiesPage'
import ProfilePage           from '@/pages/patient/ProfilePage'
import PatientServicesPage   from '@/pages/patient/ServicesPage'
import NotificationsPage     from '@/pages/patient/NotificationsPage'
import MessagesPage          from '@/pages/patient/MessagesPage'
import PaymentsPage          from '@/pages/patient/PaymentsPage'

// Facility staff
import FacilityDashboard        from '@/pages/facility/FacilityDashboard'
import FacilityAppointmentsPage from '@/pages/facility/FacilityAppointmentsPage'
import FacilityProfilePage      from '@/pages/facility/FacilityProfilePage'
import FacilityServicesPage     from '@/pages/facility/FacilityServicesPage'
import FacilityMessagesPage     from '@/pages/facility/FacilityMessagesPage'

// Admin
import AdminDashboard        from '@/pages/admin/AdminDashboard'
import AdminAppointmentsPage from '@/pages/admin/AdminAppointmentsPage'
import AdminUsersPage        from '@/pages/admin/AdminUsersPage'
import AdminFacilitiesPage   from '@/pages/admin/AdminFacilitiesPage'
import AdminAuditLogsPage    from '@/pages/admin/AdminAuditLogsPage'

// Shared
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      {/* ── Public ───────────────────────────────────────────────────── */}
      <Route path="/"         element={<LandingPage />} />
      <Route path="/services" element={<ServicesPage />} />

      {/* ── Auth (guests only) ───────────────────────────────────────── */}
      <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* ── Patient ──────────────────────────────────────────────────── */}
      <Route path="/patient" element={<ProtectedRoute allowedRoles={['patient']} />}>
        <Route path="dashboard"            element={<PatientDashboard />} />
        <Route path="appointments"         element={<AppointmentsPage />} />
        <Route path="appointments/:id"     element={<AppointmentDetailPage />} />
        <Route path="book"                 element={<BookAppointmentPage />} />
        <Route path="facilities"           element={<FacilitiesPage />} />
        <Route path="services"             element={<PatientServicesPage />} />
        <Route path="notifications"        element={<NotificationsPage />} />
        <Route path="messages"             element={<MessagesPage />} />
        <Route path="payments"             element={<PaymentsPage />} />
        <Route path="profile"              element={<ProfilePage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* ── Facility Staff ───────────────────────────────────────────── */}
      <Route path="/facility" element={<ProtectedRoute allowedRoles={['facility_staff']} />}>
        <Route path="dashboard"    element={<FacilityDashboard />} />
        <Route path="appointments" element={<FacilityAppointmentsPage />} />
        <Route path="messages"     element={<FacilityMessagesPage />} />
        <Route path="profile"      element={<FacilityProfilePage />} />
        <Route path="services"     element={<FacilityServicesPage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* ── Admin ────────────────────────────────────────────────────── */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['administrator']} />}>
        <Route path="dashboard"    element={<AdminDashboard />} />
        <Route path="users"        element={<AdminUsersPage />} />
        <Route path="facilities"   element={<AdminFacilitiesPage />} />
        <Route path="appointments" element={<AdminAppointmentsPage />} />
        <Route path="audit-logs"   element={<AdminAuditLogsPage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* ── Fallbacks ────────────────────────────────────────────────── */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*"    element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
