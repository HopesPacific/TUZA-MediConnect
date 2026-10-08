import apiClient from './client'
import type { ApiResponse, Notification, PaginatedResponse } from '@/types'

export const notificationsApi = {
  getAll: (params?: { page?: number; unread_only?: boolean }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Notification>>>('/notifications', { params }),

  markAsRead: (id: string) =>
    apiClient.patch<ApiResponse<null>>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    apiClient.patch<ApiResponse<null>>('/notifications/read-all'),

  getUnreadCount: () =>
    apiClient.get<ApiResponse<{ count: number }>>('/notifications/unread-count'),
}
