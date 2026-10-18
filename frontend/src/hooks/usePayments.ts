import { useState, useEffect, useCallback } from 'react'
import { paymentsApi, type AppPayment, type PaymentStats, type PaymentMethod } from '@/api/payments'
import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'
import type { ApiError } from '@/types'

export function usePayments() {
  const [payments,  setPayments]  = useState<AppPayment[]>([])
  const [stats,     setStats]     = useState<PaymentStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const [payRes, statsRes] = await Promise.all([
        paymentsApi.getAll({ per_page: 20 }),
        paymentsApi.getStats(),
      ])
      const payload = payRes.data.data as any
      setPayments(Array.isArray(payload) ? payload : payload.data ?? [])
      setStats(statsRes.data.data)
    } catch {
      setPayments([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { payments, stats, isLoading, refetch: load }
}

export function useInitiatePayment() {
  const [isLoading, setIsLoading] = useState(false)

  const initiate = async (data: {
    appointment_id: number
    payment_method: PaymentMethod
    amount: number
    phone?: string
  }): Promise<{ success: boolean; payment?: AppPayment }> => {
    setIsLoading(true)
    try {
      const res = await paymentsApi.initiate(data)
      toast.success('Payment initiated. Status: mock (development mode).')
      return { success: true, payment: res.data.data }
    } catch (err) {
      const e = err as AxiosError<ApiError>
      toast.error(e.response?.data?.message ?? 'Payment initiation failed.')
      return { success: false }
    } finally {
      setIsLoading(false)
    }
  }

  return { initiate, isLoading }
}

export function useVerifyPayment() {
  const [isLoading, setIsLoading] = useState(false)

  const verify = async (paymentId: number, onSuccess?: () => void): Promise<boolean> => {
    setIsLoading(true)
    try {
      const res = await paymentsApi.verify(paymentId)
      const status = res.data.data.status
      if (status === 'successful') {
        toast.success('Payment verified successfully.')
        onSuccess?.()
        return true
      } else {
        toast.error('Payment verification failed.')
        return false
      }
    } catch {
      toast.error('Could not verify payment.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { verify, isLoading }
}
