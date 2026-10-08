import apiClient from './client'
import type { ApiResponse, User, LoginCredentials, RegisterData } from '@/types'

export interface AuthTokenResponse {
  user: User
  token: string
  token_type: string
}

export const authApi = {
  register: (data: RegisterData) =>
    apiClient.post<ApiResponse<AuthTokenResponse>>('/auth/register', data),

  login: (credentials: LoginCredentials) =>
    apiClient.post<ApiResponse<AuthTokenResponse>>('/auth/login', credentials),

  logout: () =>
    apiClient.post<ApiResponse<null>>('/auth/logout'),

  me: () =>
    apiClient.get<ApiResponse<User>>('/auth/me'),

  forgotPassword: (email: string) =>
    apiClient.post<ApiResponse<null>>('/auth/forgot-password', { email }),

  resetPassword: (data: { token: string; email: string; password: string; password_confirmation: string }) =>
    apiClient.post<ApiResponse<null>>('/auth/reset-password', data),
}
