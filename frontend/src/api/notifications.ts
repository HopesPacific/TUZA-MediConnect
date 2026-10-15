import apiClient from './client'
import type { ApiResponse } from '@/types'

export interface AppNotification {
  id:         string
  type:       string
  title:      string
  message:    string
  data:       Record<string, unknown>
  read_at:    string | null
  is_read:    boolean
  created_at: string
}

export const notificationsApi = {
  getAll: (params?: { page?: number; unread_only?: boolean; per_page?: number }) =>
    apiClient.get<ApiResponse<AppNotification[]>>('/notifications', { params }),

  getUnreadCount: () =>
    apiClient.get<ApiResponse<{ count: number }>>('/notifications/unread-count'),

  markAsRead: (id: string) =>
    apiClient.patch<ApiResponse<null>>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    apiClient.patch<ApiResponse<null>>('/notifications/read-all'),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/notifications/${id}`),
}
