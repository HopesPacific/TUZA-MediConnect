import apiClient from './client'
import type { ApiResponse, User, Facility } from '@/types'

export interface AdminStats {
  users:        { total: number; patients: number; staff: number; active: number }
  facilities:   { total: number; verified: number; active: number }
  appointments: { total: number; pending: number; confirmed: number; completed: number; cancelled: number; today: number; this_month: number; completion_rate: number }
  payments:     { total_revenue: number; pending_count: number; currency: string }
}

export interface MonthlyChart {
  month:        string
  appointments: number
  completed:    number
}

export interface AdminDashboardData {
  stats:           AdminStats
  monthly_chart:   MonthlyChart[]
  recent_activity: Array<{ action: string; description: string | null; user: string; ip_address: string | null; created_at: string }>
  recent_users:    Array<{ id: number; name: string; email: string; role: string; created_at: string }>
}

export interface AuditLogEntry {
  id:          number
  action:      string
  description: string | null
  model_type:  string
  model_id:    number | null
  ip_address:  string | null
  user:        { id: number; name: string } | null
  created_at:  string
}

export const adminApi = {
  getDashboard: () =>
    apiClient.get<ApiResponse<AdminDashboardData>>('/admin/dashboard'),

  // Users
  getUsers: (params?: { role?: string; search?: string; active?: boolean; page?: number }) =>
    apiClient.get<ApiResponse<User[]>>('/admin/users', { params }),

  getUserStats: () =>
    apiClient.get<ApiResponse<{ total: number; patients: number; staff: number; active: number; inactive: number }>>('/admin/users/stats'),

  getUser: (id: number) =>
    apiClient.get<ApiResponse<User>>(`/admin/users/${id}`),

  toggleUserActive: (id: number) =>
    apiClient.patch<ApiResponse<User>>(`/admin/users/${id}/toggle-active`),

  // Facilities
  getFacilities: (params?: { search?: string; type?: string; verified?: boolean; page?: number }) =>
    apiClient.get<ApiResponse<Facility[]>>('/admin/facilities', { params }),

  createFacility: (data: object) =>
    apiClient.post<ApiResponse<Facility>>('/admin/facilities', data),

  updateFacility: (id: number, data: object) =>
    apiClient.put<ApiResponse<Facility>>(`/admin/facilities/${id}`, data),

  verifyFacility: (id: number) =>
    apiClient.patch<ApiResponse<Facility>>(`/admin/facilities/${id}/verify`),

  toggleFacilityActive: (id: number) =>
    apiClient.patch<ApiResponse<Facility>>(`/admin/facilities/${id}/toggle-active`),

  deleteFacility: (id: number) =>
    apiClient.delete<ApiResponse<null>>(`/admin/facilities/${id}`),

  // Audit logs
  getAuditLogs: (params?: { action?: string; user_id?: number; page?: number }) =>
    apiClient.get<ApiResponse<AuditLogEntry[]>>('/admin/audit-logs', { params }),

  // Appointments
  getAppointments: (params?: { status?: string; search?: string; page?: number }) =>
    apiClient.get<ApiResponse<unknown>>('/admin/appointments', { params }),

  getAppointmentStats: () =>
    apiClient.get<ApiResponse<unknown>>('/admin/appointments/stats'),
}
