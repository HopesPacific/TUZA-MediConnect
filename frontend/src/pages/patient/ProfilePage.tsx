import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { User, Phone, MapPin, Calendar, Heart, Shield, Lock, Save } from 'lucide-react'
import { PatientLayout } from '@/components/layout/PatientLayout'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { Button } from '@/components/common/Button'
import { Alert } from '@/components/common/Alert'
import { ProfileCompletionCard } from '@/components/patient/ProfileCompletionCard'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'
import type { ApiError } from '@/types'
import { clsx } from 'clsx'

const TABS = ['Personal Info', 'Medical Info', 'Emergency Contact', 'Change Password'] as const
type Tab = typeof TABS[number]

interface ProfileForm {
  name:                        string
  phone:                       string
  date_of_birth:               string
  gender:                      string
  location:                    string
  address:                     string
  blood_group:                 string
  allergies:                   string
  chronic_conditions:          string
  emergency_contact_name:      string
  emergency_contact_phone:     string
  emergency_contact_relation:  string
}

interface PasswordForm {
  current_password: string
  password:         string
  password_confirmation: string
}

export default function ProfilePage() {
  const [activeTab, setActiveTab]   = useState<Tab>('Personal Info')
  const [isSaving,  setIsSaving]    = useState(false)
  const [profile,   setProfile]     = useState<any>(null)
  const { updateUser }              = useAuthStore()

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProfileForm>()
  const { register: regPwd, handleSubmit: handlePwd, reset: resetPwd,
          formState: { errors: pwdErrors }, watch: watchPwd } = useForm<PasswordForm>()
  const newPassword = watchPwd('password', '')

  // Load current profile
  useEffect(() => {
    authApi.me().then(res => {
      const u = res.data.data
      const p = (u as any).patient_profile
      setProfile(p)
      reset({
        name:                       u.name,
        phone:                      u.phone,
        date_of_birth:              p?.date_of_birth ?? '',
        gender:                     p?.gender ?? '',
        location:                   p?.location ?? '',
        address:                    p?.address ?? '',
        blood_group:                p?.blood_group ?? '',
        allergies:                  p?.allergies ?? '',
        chronic_conditions:         p?.chronic_conditions ?? '',
        emergency_contact_name:     p?.emergency_contact_name ?? '',
        emergency_contact_phone:    p?.emergency_contact_phone ?? '',
        emergency_contact_relation: p?.emergency_contact_relation ?? '',
      })
    }).catch(() => {})
  }, [reset])

  const onSaveProfile = async (data: ProfileForm) => {
    setIsSaving(true)
    try {
      const res = await authApi.updateProfile(data)
      const updatedUser = res.data.data
      updateUser({ name: updatedUser.name, phone: updatedUser.phone })
      setProfile((updatedUser as any).patient_profile)
      toast.success('Profile updated successfully.')
    } catch (err) {
      const e = err as AxiosError<ApiError>
      toast.error(e.response?.data?.message ?? 'Failed to update profile.')
    } finally {
      setIsSaving(false)
    }
  }

  const onChangePassword = async (data: PasswordForm) => {
    setIsSaving(true)
    try {
      await authApi.changePassword(data)
      toast.success('Password changed successfully.')
      resetPwd()
    } catch (err) {
      const e = err as AxiosError<ApiError>
      toast.error(e.response?.data?.message ?? 'Failed to change password.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <PatientLayout title="My Profile" subtitle="Manage your personal and medical information.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Profile completion */}
        <div className="lg:col-span-1">
          <ProfileCompletionCard
            completion={profile?.profile_completion ?? 0}
            profile={profile}
          />
        </div>

        {/* Right: Tabs + Forms */}
        <div className="lg:col-span-2">
          {/* Tab bar */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={clsx(
                  'flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  activeTab === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700',
                )}>
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSaveProfile)}>

            {/* ── Personal Info ─────────────────────────────────────── */}
            {activeTab === 'Personal Info' && (
              <div className="card p-5 space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                  <User size={16} className="text-primary-600" /> Personal Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Full name" leftIcon={<User size={15} />}
                    error={errors.name?.message}
                    {...register('name', { required: 'Name is required.' })} />
                  <Input label="Phone number" type="tel" leftIcon={<Phone size={15} />}
                    error={errors.phone?.message}
                    {...register('phone')} />
                  <Input label="Date of birth" type="date" leftIcon={<Calendar size={15} />}
                    {...register('date_of_birth')} />
                  <Select label="Gender"
                    options={[
                      { value: 'male',              label: 'Male'              },
                      { value: 'female',            label: 'Female'            },
                      { value: 'other',             label: 'Other'             },
                      { value: 'prefer_not_to_say', label: 'Prefer not to say' },
                    ]}
                    {...register('gender')} />
                  <Input label="City / Location" leftIcon={<MapPin size={15} />}
                    placeholder="e.g. Nairobi"
                    {...register('location')} />
                  <Input label="Full address"
                    placeholder="Street address"
                    {...register('address')} />
                </div>
                <div className="pt-2">
                  <Button type="submit" isLoading={isSaving} disabled={!isDirty}
                    leftIcon={<Save size={15} />}>
                    Save changes
                  </Button>
                </div>
              </div>
            )}

            {/* ── Medical Info ──────────────────────────────────────── */}
            {activeTab === 'Medical Info' && (
              <div className="card p-5 space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                  <Heart size={16} className="text-primary-600" /> Medical Information
                </h3>
                <Alert variant="info">
                  This information helps healthcare providers give you better care. It is kept private and only shared with your care team.
                </Alert>
                <Select label="Blood group"
                  options={['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(v => ({ value: v, label: v }))}
                  {...register('blood_group')} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Allergies</label>
                  <textarea rows={3} placeholder="List any known allergies…"
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                    {...register('allergies')} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Chronic conditions</label>
                  <textarea rows={3} placeholder="List any chronic conditions…"
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                    {...register('chronic_conditions')} />
                </div>
                <Button type="submit" isLoading={isSaving} leftIcon={<Save size={15} />}>
                  Save changes
                </Button>
              </div>
            )}

            {/* ── Emergency Contact ─────────────────────────────────── */}
            {activeTab === 'Emergency Contact' && (
              <div className="card p-5 space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                  <Shield size={16} className="text-primary-600" /> Emergency Contact
                </h3>
                <p className="text-sm text-gray-500">
                  This person will be contacted in case of a medical emergency.
                </p>
                <Input label="Contact name" leftIcon={<User size={15} />}
                  placeholder="e.g. Jane Mwangi"
                  {...register('emergency_contact_name')} />
                <Input label="Contact phone" type="tel" leftIcon={<Phone size={15} />}
                  placeholder="+254712345678"
                  {...register('emergency_contact_phone')} />
                <Input label="Relationship"
                  placeholder="e.g. Spouse, Parent, Sibling"
                  {...register('emergency_contact_relation')} />
                <Button type="submit" isLoading={isSaving} leftIcon={<Save size={15} />}>
                  Save changes
                </Button>
              </div>
            )}
          </form>

          {/* ── Change Password ───────────────────────────────────── */}
          {activeTab === 'Change Password' && (
            <form onSubmit={handlePwd(onChangePassword)}>
              <div className="card p-5 space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                  <Lock size={16} className="text-primary-600" /> Change Password
                </h3>
                <Input label="Current password" isPassword
                  error={pwdErrors.current_password?.message}
                  {...regPwd('current_password', { required: 'Current password is required.' })} />
                <Input label="New password" isPassword
                  hint="Min 8 characters with uppercase, lowercase, and a number."
                  error={pwdErrors.password?.message}
                  {...regPwd('password', {
                    required: 'New password is required.',
                    minLength: { value: 8, message: 'Must be at least 8 characters.' },
                    pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, message: 'Must include uppercase, lowercase and a number.' },
                  })} />
                <Input label="Confirm new password" isPassword
                  error={pwdErrors.password_confirmation?.message}
                  {...regPwd('password_confirmation', {
                    required: 'Please confirm your new password.',
                    validate: v => v === newPassword || 'Passwords do not match.',
                  })} />
                <Button type="submit" isLoading={isSaving} leftIcon={<Lock size={15} />}>
                  Update password
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </PatientLayout>
  )
}
