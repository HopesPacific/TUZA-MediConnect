import apiClient from './client'
import type { ApiResponse, Appointment, CreateAppointmentData, PaginatedResponse } from '@/types'

export const appointmentsApi = {
  create: (data: CreateAppointmentData) =>
    apiClient.post<ApiResponse<Appointment>>('/appointments', data),

  getMyAppointments: (params?: { status?: string; page?: number }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Appointment>>>('/appointments', { params }),

  getById: (id: number) =>
    apiClient.get<ApiResponse<Appointment>>(`/appointments/${id}`),

  cancel: (id: number, reason?: string) =>
    apiClient.patch<ApiResponse<Appointment>>(`/appointments/${id}/cancel`, { reason }),

  // Facility staff actions
  confirm: (id: number) =>
    apiClient.patch<ApiResponse<Appointment>>(`/appointments/${id}/confirm`),

  reject: (id: number, reason: string) =>
    apiClient.patch<ApiResponse<Appointment>>(`/appointments/${id}/reject`, { reason }),

  reschedule: (id: number, data: { appointment_date: string; appointment_time: string }) =>
    apiClient.patch<ApiResponse<Appointment>>(`/appointments/${id}/reschedule`, data),

  complete: (id: number) =>
    apiClient.patch<ApiResponse<Appointment>>(`/appointments/${id}/complete`),

  // Facility staff — get facility appointments
  getFacilityAppointments: (facilityId: number, params?: { status?: string; date?: string; page?: number }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Appointment>>>(`/facility/${facilityId}/appointments`, { params }),
}
