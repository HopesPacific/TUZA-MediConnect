import { useState, useEffect, useCallback } from 'react'
import { facilityApi, type FacilityDashboardData } from '@/api/facility'
import toast from 'react-hot-toast'

export function useFacilityDashboard() {
  const [data,      setData]      = useState<FacilityDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await facilityApi.getDashboard()
      setData(res.data.data)
    } catch {
      setError('Failed to load dashboard.')
      toast.error('Could not load facility dashboard.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { data, isLoading, error, refetch: fetch }
}

export function useFacilityAppointmentActions(onSuccess?: () => void) {
  const [loadingId, setLoadingId] = useState<number | null>(null)

  const action = async (
    id: number,
    fn: () => Promise<unknown>,
    successMsg: string
  ) => {
    setLoadingId(id)
    try {
      await fn()
      toast.success(successMsg)
      onSuccess?.()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Action failed.')
    } finally {
      setLoadingId(null)
    }
  }

  return {
    loadingId,
    confirm:    (id: number) => action(id, () => facilityApi.confirmAppointment(id),   'Appointment confirmed.'),
    complete:   (id: number) => action(id, () => facilityApi.completeAppointment(id),  'Marked as completed.'),
    reject:     (id: number, reason: string) => action(id, () => facilityApi.rejectAppointment(id, reason),  'Appointment rejected.'),
    reschedule: (id: number, date: string, time: string, reason?: string) =>
      action(id, () => facilityApi.rescheduleAppointment(id, { appointment_date: date, appointment_time: time, reason }), 'Appointment rescheduled.'),
  }
}
