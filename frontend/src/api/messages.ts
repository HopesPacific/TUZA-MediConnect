import apiClient from './client'
import type { ApiResponse } from '@/types'

export interface AppMessage {
  id:           number
  subject:      string
  body:         string
  is_read:      boolean
  read_at:      string | null
  parent_id:    number | null
  reply_count?: number
  sender:   { id: number; name: string; role: string }
  receiver: { id: number; name: string; role: string }
  facility: { id: number; name: string }
  appointment?: { id: number; date: string; status: string } | null
  replies?:     AppMessage[]
  created_at:   string
}

export interface SendMessageData {
  facility_id:     number
  subject:         string
  body:            string
  appointment_id?: number
  parent_id?:      number
}

export const messagesApi = {
  getInbox: (params?: { page?: number; per_page?: number; unread_only?: boolean; facility_id?: number }) =>
    apiClient.get<ApiResponse<AppMessage[]>>('/messages', { params }),

  getUnreadCount: () =>
    apiClient.get<ApiResponse<{ count: number }>>('/messages/unread-count'),

  getMessage: (id: number) =>
    apiClient.get<ApiResponse<AppMessage>>(`/messages/${id}`),

  send: (data: SendMessageData) =>
    apiClient.post<ApiResponse<AppMessage>>('/messages', data),

  markAsRead: (id: number) =>
    apiClient.patch<ApiResponse<null>>(`/messages/${id}/read`),

  delete: (id: number) =>
    apiClient.delete<ApiResponse<null>>(`/messages/${id}`),
}
