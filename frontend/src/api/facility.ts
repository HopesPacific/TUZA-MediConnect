import apiClient from './client'
import type { ApiResponse, PaginatedResponse, Service } from '@/types'

export interface FacilityAppointment {
  id:                  number
  appointment_date:    string
  appointment_time:    string
  reason:              string
  status:              string
  status_label:        string
  status_color:        string
  notes:               string | null
  rejection_reason:    string | null
  reschedule_date:     string | null
  reschedule_time:     string | null
  reschedule_reason:   string | null
  cancellation_reason: string | null
  completed_at:        string | null
  patient: { id: number; name: string; email: string; phone: string }
  service: Service
  created_at: string
}

export interface FacilityDashboardData {
  facility: { id: number; name: string; type: string; location: string; is_verified: boolean }
  staff:    { id: number; name: string; job_title: string | null }
  stats: {
    today_total:      number
    today_confirmed:  number
    today_completed:  number
    pending_requests: number
    total_this_month: number
    completed_total:  number
  }
  today_appointments:   FacilityAppointment[]
  upcoming_confirmed:   FacilityAppointment[]
}

export interface AppointmentFilters {
  status?:   string
  date?:     string
  search?:   string
  page?:     number
  per_page?: number
}

export const facilityApi = {
  // Dashboard
  getDashboard: () =>
    apiClient.get<ApiResponse<FacilityDashboardData>>('/facility/dashboard'),

  // Appointment management
  getAppointments: (params?: AppointmentFilters) =>
    apiClient.get<ApiResponse<PaginatedResponse<FacilityAppointment>>>('/facility/appointments', { params }),

  getAppointment: (id: number) =>
    apiClient.get<ApiResponse<FacilityAppointment>>(`/facility/appointments/${id}`),

  getStats: () =>
    apiClient.get<ApiResponse<{ pending: number; confirmed: number; today: number; completed_total: number; this_month: number }>>('/facility/appointments/stats'),

  confirmAppointment: (id: number) =>
    apiClient.patch<ApiResponse<FacilityAppointment>>(`/facility/appointments/${id}/confirm`),

  rejectAppointment: (id: number, reason: string) =>
    apiClient.patch<ApiResponse<FacilityAppointment>>(`/facility/appointments/${id}/reject`, { reason }),

  rescheduleAppointment: (id: number, data: { appointment_date: string; appointment_time: string; reason?: string }) =>
    apiClient.patch<ApiResponse<FacilityAppointment>>(`/facility/appointments/${id}/reschedule`, data),

  completeAppointment: (id: number) =>
    apiClient.patch<ApiResponse<FacilityAppointment>>(`/facility/appointments/${id}/complete`),

  // Facility profile
  getProfile: () =>
    apiClient.get<ApiResponse<import('@/types').Facility>>('/facility/profile'),

  updateProfile: (data: object) =>
    apiClient.put<ApiResponse<import('@/types').Facility>>('/facility/profile', data),

  // Services
  listServices: () =>
    apiClient.get<ApiResponse<Service[]>>('/facility/services'),

  addService: (serviceId: number, data: { price?: number; duration_minutes?: number; notes?: string }) =>
    apiClient.post<ApiResponse<null>>(`/facility/services/${serviceId}`, data),

  removeService: (serviceId: number) =>
    apiClient.delete<ApiResponse<null>>(`/facility/services/${serviceId}`),

  toggleService: (serviceId: number) =>
    apiClient.patch<ApiResponse<null>>(`/facility/services/${serviceId}/toggle`),
}
