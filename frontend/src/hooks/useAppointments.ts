import { useState, useEffect, useCallback } from 'react'
import { patientApi } from '@/api/patient'
import type { Appointment, PaginatedResponse } from '@/types'
import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'
import type { ApiError } from '@/types'

export function useAppointments(filters?: { status?: string; upcoming?: boolean }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [meta,         setMeta]         = useState<{ current_page: number; last_page: number; total: number } | null>(null)
  const [isLoading,    setIsLoading]    = useState(true)
  const [page,         setPage]         = useState(1)

  const fetch = useCallback(async (p = 1) => {
    setIsLoading(true)
    try {
      const res = await patientApi.getAppointments({ ...filters, page: p, per_page: 10 })
      const payload = res.data.data as unknown as PaginatedResponse<Appointment> & { data: Appointment[] }
      // Laravel resource collection wraps items in .data
      const items = Array.isArray(payload) ? payload : (payload as any).data ?? payload
      setAppointments(items)
      if ((payload as any).meta) setMeta((payload as any).meta)
    } catch {
      toast.error('Could not load appointments.')
    } finally {
      setIsLoading(false)
    }
  }, [filters?.status, filters?.upcoming])

  useEffect(() => { fetch(page) }, [fetch, page])

  return { appointments, meta, isLoading, page, setPage, refetch: () => fetch(page) }
}

export function useBookAppointment() {
  const [isLoading, setIsLoading] = useState(false)

  const book = async (data: import('@/types').CreateAppointmentData): Promise<{ success: boolean; appointment?: Appointment; error?: string }> => {
    setIsLoading(true)
    try {
      const res = await patientApi.bookAppointment(data)
      toast.success('Appointment booked! You will be notified when it is confirmed.')
      return { success: true, appointment: res.data.data }
    } catch (err) {
      const e = err as AxiosError<ApiError>
      const msg = e.response?.data?.message ?? 'Failed to book appointment.'
      toast.error(msg)
      return { success: false, error: msg }
    } finally {
      setIsLoading(false)
    }
  }

  return { book, isLoading }
}

export function useCancelAppointment() {
  const [isLoading, setIsLoading] = useState(false)

  const cancel = async (id: number, reason?: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      await patientApi.cancelAppointment(id, reason)
      toast.success('Appointment cancelled successfully.')
      return true
    } catch (err) {
      const e = err as AxiosError<ApiError>
      toast.error(e.response?.data?.message ?? 'Could not cancel appointment.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { cancel, isLoading }
}
