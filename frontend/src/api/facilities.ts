import apiClient from './client'
import type { ApiResponse, Facility, PaginatedResponse } from '@/types'

export interface FacilityFilters {
  search?: string
  type?: string
  location?: string
  page?: number
  per_page?: number
}

export const facilitiesApi = {
  getAll: (filters?: FacilityFilters) =>
    apiClient.get<ApiResponse<PaginatedResponse<Facility>>>('/facilities', { params: filters }),

  getById: (id: number) =>
    apiClient.get<ApiResponse<Facility>>(`/facilities/${id}`),

  create: (data: FormData) =>
    apiClient.post<ApiResponse<Facility>>('/admin/facilities', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: number, data: FormData) =>
    apiClient.post<ApiResponse<Facility>>(`/admin/facilities/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id: number) =>
    apiClient.delete<ApiResponse<null>>(`/admin/facilities/${id}`),
}
