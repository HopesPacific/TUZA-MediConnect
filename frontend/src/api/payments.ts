import apiClient from './client'
import type { ApiResponse } from '@/types'

export type PaymentMethod = 'mpesa' | 'card' | 'bank_transfer' | 'cash' | 'insurance'
export type PaymentStatus = 'pending' | 'successful' | 'failed' | 'cancelled' | 'refunded'

export interface AppPayment {
  id:              number
  amount:          number
  currency:        string
  status:          PaymentStatus
  status_label:    string
  payment_method:  PaymentMethod
  provider:        string
  transaction_ref: string | null
  failure_reason:  string | null
  paid_at:         string | null
  created_at:      string
  appointment?: {
    id:               number
    appointment_date: string
    appointment_time: string
    facility_name:    string
    service_name:     string
    status:           string
  } | null
}

export interface PaymentStats {
  total_paid:    number
  pending_count: number
  total_count:   number
  currency:      string
}

export const paymentsApi = {
  getAll: (params?: { page?: number; per_page?: number }) =>
    apiClient.get<ApiResponse<AppPayment[]>>('/payments', { params }),

  getStats: () =>
    apiClient.get<ApiResponse<PaymentStats>>('/payments/stats'),

  getById: (id: number) =>
    apiClient.get<ApiResponse<AppPayment>>(`/payments/${id}`),

  initiate: (data: {
    appointment_id: number
    payment_method: PaymentMethod
    amount: number
    currency?: string
    phone?: string
  }) => apiClient.post<ApiResponse<AppPayment>>('/payments', data),

  verify: (id: number) =>
    apiClient.post<ApiResponse<AppPayment>>(`/payments/${id}/verify`),
}
