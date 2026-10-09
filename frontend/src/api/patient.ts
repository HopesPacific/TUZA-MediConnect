import apiClient from './client'
import type { ApiResponse, PaginatedResponse, Appointment, CreateAppointmentData } from '@/types'

export interface PatientDashboardData {
  user: { id: number; name: string; email: string; phone: string; role: string }
  profile: {
    date_of_birth: string | null
    gender: string | null
    location: string | null
    blood_group: string | null
    profile_completion: number
    emergency_contact_name: string | null
    emergency_contact_phone: string | null
  } | null
  stats: {
    upcoming: number
    pending: number
    completed: number
    total: number
  }
  upcoming_appointments: Appointment[]
  recent_history: Appointment[]
}

export interface AvailableSlotsData {
  date: string
  slots: string[]
  booked: string[]
}

export const patientApi = {
  getDashboard: () =>
    apiClient.get<ApiResponse<PatientDashboardData>>('/patient/dashboard'),

  getAppointments: (params?: { status?: string; upcoming?: boolean; page?: number; per_page?: number }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Appointment>>>('/appointments', { params }),

  getAppointmentStats: () =>
    apiClient.get<ApiResponse<{ upcoming: number; pending: number; completed: number; total: number }>>('/appointments/stats'),

  getAppointment: (id: number) =>
    apiClient.get<ApiResponse<Appointment>>(`/appointments/${id}`),

  bookAppointment: (data: CreateAppointmentData) =>
    apiClient.post<ApiResponse<Appointment>>('/appointments', data),

  cancelAppointment: (id: number, reason?: string) =>
    apiClient.patch<ApiResponse<Appointment>>(`/appointments/${id}/cancel`, { reason }),

  getFacilities: (params?: { search?: string; type?: string; location?: string; page?: number; per_page?: number }) =>
    apiClient.get<ApiResponse<PaginatedResponse<import('@/types').Facility>>>('/facilities', { params }),

  getFacility: (id: number) =>
    apiClient.get<ApiResponse<import('@/types').Facility>>(`/facilities/${id}`),

  getAvailableSlots: (facilityId: number, date: string) =>
    apiClient.get<ApiResponse<AvailableSlotsData>>(`/facilities/${facilityId}/available-slots`, { params: { date } }),
}
