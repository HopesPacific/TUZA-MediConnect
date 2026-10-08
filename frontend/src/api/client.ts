import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { ApiError } from '@/types'

/**
 * Central Axios instance for all API calls.
 *
 * What this does:
 * - Sets the base URL from .env so we never hardcode the backend address
 * - Attaches the auth token automatically on every request
 * - Handles 401 (expired token) globally — redirects to login
 * - Returns consistent error shapes to all callers
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // needed for Sanctum cookie-based auth if used
})

// ── Request interceptor ───────────────────────────────────────────────────────
// Attaches the Bearer token from localStorage before every request.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor ──────────────────────────────────────────────────────
// Handles global error cases so individual components don't have to.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect to login
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')

      // Avoid redirect loop if already on the login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }

    // Re-throw so individual callers can still handle the error
    return Promise.reject(error)
  },
)

export default apiClient
