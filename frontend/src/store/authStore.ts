import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '@/types'

/**
 * Global authentication store using Zustand with persistence.
 *
 * Why Zustand over Context?
 * - No Provider boilerplate
 * - Automatic localStorage persistence via the persist middleware
 * - Subscriptions are fine-grained — only re-renders components that use specific slices
 */

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean

  // Actions
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        // Also store token in localStorage for the Axios interceptor
        localStorage.setItem('auth_token', token)
        set({ user, token, isAuthenticated: true })
      },

      clearAuth: () => {
        localStorage.removeItem('auth_token')
        set({ user: null, token: null, isAuthenticated: false })
      },

      updateUser: (partialUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partialUser } : null,
        })),
    }),
    {
      name: 'tuza-auth', // localStorage key
      // Only persist these fields — don't persist loading states
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

// ── Convenience selectors ─────────────────────────────────────────────────────
// Use these in components instead of selecting the whole store.

export const useCurrentUser = () => useAuthStore((s) => s.user)
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated)
export const useUserRole = (): UserRole | null => useAuthStore((s) => s.user?.role ?? null)

export const useIsPatient = () => useAuthStore((s) => s.user?.role === 'patient')
export const useIsStaff = () => useAuthStore((s) => s.user?.role === 'facility_staff')
export const useIsAdmin = () => useAuthStore((s) => s.user?.role === 'administrator')
