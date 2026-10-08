import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import type { LoginCredentials, RegisterData, UserRole } from '@/types'
import type { AxiosError } from 'axios'
import type { ApiError } from '@/types'

/**
 * Central auth hook — used by all login/register/logout components.
 *
 * Why a hook instead of calling the store directly?
 * - Keeps side effects (toast, navigation, loading state) in one place
 * - Components stay declarative — they just call login() / logout()
 * - Easy to test in isolation
 */
export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const { setAuth, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const dashboardRoute: Record<UserRole, string> = {
    patient:        '/patient/dashboard',
    facility_staff: '/facility/dashboard',
    administrator:  '/admin/dashboard',
  }

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true)
    try {
      const res = await authApi.login(credentials)
      const { user, token } = res.data.data

      setAuth(user, token)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
      navigate(dashboardRoute[user.role])
      return true
    } catch (err) {
      const error = err as AxiosError<ApiError>
      const message = error.response?.data?.message ?? 'Login failed. Please try again.'
      toast.error(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // ── Register ───────────────────────────────────────────────────────────────
  const register = async (data: RegisterData): Promise<{ success: boolean; errors?: Record<string, string[]> }> => {
    setIsLoading(true)
    try {
      const res = await authApi.register(data)
      const { user, token } = res.data.data

      setAuth(user, token)
      toast.success('Account created! Welcome to Tuza MediConnect.')
      navigate(dashboardRoute[user.role])
      return { success: true }
    } catch (err) {
      const error = err as AxiosError<ApiError>
      if (error.response?.status === 422) {
        // Return validation errors so the form can display them inline
        return { success: false, errors: error.response.data.errors }
      }
      toast.error(error.response?.data?.message ?? 'Registration failed. Please try again.')
      return { success: false }
    } finally {
      setIsLoading(false)
    }
  }

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = async (): Promise<void> => {
    try {
      await authApi.logout()
    } catch {
      // Even if the API call fails, clear local state
    } finally {
      clearAuth()
      toast.success('You have been logged out.')
      navigate('/login')
    }
  }

  return { login, register, logout, isLoading }
}
