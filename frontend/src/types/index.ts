// ─── User & Auth ──────────────────────────────────────────────────────────────

export type UserRole = 'patient' | 'facility_staff' | 'administrator'

export interface User {
  id: number
  name: string
  email: string
  phone: string
  role: UserRole
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
  password_confirmation: string
  date_of_birth: string
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  location: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
}

// ─── Patient Profile ──────────────────────────────────────────────────────────

export interface PatientProfile {
  id: number
  user_id: number
  date_of_birth: string
  gender: string
  location: string
  blood_group: string | null
  allergies: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  profile_photo: string | null
  profile_completion: number
  user: User
}

// ─── Healthcare Facility ──────────────────────────────────────────────────────

export type FacilityType =
  | 'hospital'
  | 'clinic'
  | 'pharmacy'
  | 'laboratory'
  | 'dental'
  | 'eye_care'
  | 'mental_health'
  | 'maternity'
  | 'other'

export interface Facility {
  id: number
  name: string
  type: FacilityType
  description: string
  location: string
  address: string
  phone: string
  email: string
  website: string | null
  opening_hours: OpeningHours
  logo: string | null
  cover_image: string | null
  is_active: boolean
  is_verified: boolean
  rating: number | null
  services: Service[]
  created_at: string
}

export interface OpeningHours {
  monday?: DayHours
  tuesday?: DayHours
  wednesday?: DayHours
  thursday?: DayHours
  friday?: DayHours
  saturday?: DayHours
  sunday?: DayHours
}

export interface DayHours {
  open: string   // e.g. "08:00"
  close: string  // e.g. "17:00"
  closed: boolean
}

// ─── Service ──────────────────────────────────────────────────────────────────

export interface Service {
  id: number
  name: string
  category: string
  description: string
  duration_minutes: number
  price: number | null
  currency: string
  is_active: boolean
}

// ─── Appointment ──────────────────────────────────────────────────────────────

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'rescheduled'
  | 'completed'
  | 'cancelled'
  | 'rejected'

export interface Appointment {
  id: number
  patient_id: number
  facility_id: number
  service_id: number
  appointment_date: string
  appointment_time: string
  reason: string
  status: AppointmentStatus
  notes: string | null
  rejection_reason: string | null
  reschedule_date: string | null
  reschedule_time: string | null
  patient: PatientProfile
  facility: Facility
  service: Service
  created_at: string
  updated_at: string
}

export interface CreateAppointmentData {
  facility_id: number
  service_id: number
  appointment_date: string
  appointment_time: string
  reason: string
}

// ─── Notification ─────────────────────────────────────────────────────────────

export type NotificationType =
  | 'appointment_requested'
  | 'appointment_confirmed'
  | 'appointment_rejected'
  | 'appointment_rescheduled'
  | 'appointment_reminder'
  | 'appointment_cancelled'
  | 'message_received'
  | 'general'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  data: Record<string, unknown>
  read_at: string | null
  created_at: string
}

// ─── Message ──────────────────────────────────────────────────────────────────

export interface Message {
  id: number
  sender_id: number
  receiver_id: number
  facility_id: number
  subject: string
  body: string
  is_read: boolean
  parent_id: number | null
  sender: User
  created_at: string
}

// ─── Payment ──────────────────────────────────────────────────────────────────

export type PaymentStatus = 'pending' | 'successful' | 'failed' | 'cancelled' | 'refunded'
export type PaymentMethod = 'mpesa' | 'card' | 'bank_transfer' | 'cash' | 'insurance'

export interface Payment {
  id: number
  user_id: number
  appointment_id: number | null
  amount: number
  currency: string
  provider: string
  transaction_ref: string | null
  status: PaymentStatus
  payment_method: PaymentMethod
  paid_at: string | null
  created_at: string
}

// ─── API Response Shapes ──────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
  meta?: PaginationMeta
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}
