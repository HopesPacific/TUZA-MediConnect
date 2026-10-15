import apiClient from './client'
import type { ApiResponse, Service } from '@/types'

export interface ServiceCategory {
  value: string
  label: string
  count: number
}

export interface GroupedServices {
  category: string
  label:    string
  services: Service[]
}

export interface ServiceDetail extends Service {
  facility_count: number
  facilities: Array<{
    id:          number
    name:        string
    location:    string
    type:        string
    is_verified: boolean
    price:       number | null
    currency:    string
  }>
}

export const servicesApi = {
  getAll: (params?: { category?: string; search?: string; grouped?: boolean; include_inactive?: boolean }) =>
    apiClient.get<ApiResponse<Service[] | GroupedServices[]>>('/services', { params }),

  getCategories: () =>
    apiClient.get<ApiResponse<ServiceCategory[]>>('/services/categories'),

  getById: (id: number) =>
    apiClient.get<ApiResponse<ServiceDetail>>(`/services/${id}`),

  // Admin
  create: (data: { name: string; category: string; description?: string; icon?: string; sort_order?: number }) =>
    apiClient.post<ApiResponse<Service>>('/admin/services', data),

  update: (id: number, data: Partial<Service>) =>
    apiClient.put<ApiResponse<Service>>(`/admin/services/${id}`, data),

  delete: (id: number) =>
    apiClient.delete<ApiResponse<null>>(`/admin/services/${id}`),

  toggle: (id: number) =>
    apiClient.patch<ApiResponse<Service>>(`/admin/services/${id}/toggle`),
}
