import { useState, useEffect, useCallback } from 'react'
import { patientApi, type PatientDashboardData } from '@/api/patient'
import toast from 'react-hot-toast'

/**
 * Fetches and manages all data needed for the patient dashboard.
 * Single API call returns everything to minimize loading flicker.
 */
export function usePatientDashboard() {
  const [data,      setData]      = useState<PatientDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await patientApi.getDashboard()
      setData(res.data.data)
    } catch {
      setError('Failed to load dashboard. Please refresh.')
      toast.error('Could not load your dashboard.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { data, isLoading, error, refetch: fetch }
}
