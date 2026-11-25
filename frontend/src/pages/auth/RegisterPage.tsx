import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { User, Mail, Phone, Lock, MapPin, Calendar, ChevronRight, ChevronLeft } from 'lucide-react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { Alert } from '@/components/common/Alert'
import { PasswordStrength } from '@/components/common/PasswordStrength'
import { useAuth } from '@/hooks/useAuth'
import type { RegisterData } from '@/types'

type FormData = RegisterData & { password_confirmation: string }

const STEPS = ['Account', 'Personal', 'Emergency'] as const
type Step = 0 | 1 | 2

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuth()
  const [step, setStep] = useState<Step>(0)
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({})

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
    setError,
  } = useForm<FormData>({ mode: 'onTouched' })

  const password = watch('password', '')

  // Validate current step fields before advancing
  const stepFields: Record<Step, (keyof FormData)[]> = {
    0: ['name', 'email', 'phone', 'password', 'password_confirmation'],
    1: ['date_of_birth', 'gender', 'location'],
    2: [],
  }

  const nextStep = async () => {
    const valid = await trigger(stepFields[step])
    if (valid) setStep(s => (s + 1) as Step)
  }

  const onSubmit = async (data: FormData) => {
    setServerErrors({})
    const result = await registerUser(data)
    if (!result.success && result.errors) {
      setServerErrors(result.errors)
      // Map server errors back to form fields
      Object.entries(result.errors).forEach(([field, messages]) => {
        setError(field as keyof FormData, { message: messages[0] })
      })
      // Jump to the step that has the error
      const errorFields = Object.keys(result.errors) as (keyof FormData)[]
      for (let s = 0; s <= 2; s++) {
        if (stepFields[s as Step].some(f => errorFields.includes(f))) {
          setStep(s as Step)
          break
        }
      }
    }
  }

  // Step progress indicator
  const StepIndicator = () => (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-colors ${
            i < step  ? 'bg-primary-600 text-white' :
            i === step ? 'bg-primary-600 text-white' :
                        'bg-gray-200 text-gray-500'
          }`}>
            {i < step ? '✓' : i + 1}
          </div>
          <span className={`text-xs font-medium ${i === step ? 'text-primary-600' : 'text-gray-400'}`}>
            {label}
          </span>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-px w-6 ${i < step ? 'bg-primary-400' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of patients using Tuza MediConnect"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <StepIndicator />

      {Object.keys(serverErrors).length > 0 && step === 0 && (
        <Alert variant="error" className="mb-5">
          Please fix the errors below and try again.
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        {/* ── Step 0: Account credentials ──────────────────────────────── */}
        {step === 0 && (
          <div className="space-y-4">
            <Input
              label="Full name"
              placeholder="Jean Pierre Kagabo"
              autoComplete="name"
              leftIcon={<User size={16} />}
              error={errors.name?.message}
              required
              {...register('name', {
                required: 'Full name is required.',
                minLength: { value: 2, message: 'Name must be at least 2 characters.' },
              })}
            />

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              required
              {...register('email', {
                required: 'Email address is required.',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address.' },
              })}
            />

            <Input
              label="Phone number"
              type="tel"
              placeholder="+250788123456"
              autoComplete="tel"
              leftIcon={<Phone size={16} />}
              hint="Shyiramo code y'igihugu, urugero: +250788123456"
              error={errors.phone?.message}
              required
              {...register('phone', {
                required: 'Phone number is required.',
                pattern: { value: /^\+?[1-9]\d{7,14}$/, message: 'Injira nimero y\'imodoka nzima hamwe na code y\'igihugu.' },
              })}
            />

            <div>
              <Input
                label="Password"
                isPassword
                placeholder="Create a strong password"
                autoComplete="new-password"
                leftIcon={<Lock size={16} />}
                error={errors.password?.message}
                required
                {...register('password', {
                  required: 'Password is required.',
                  minLength: { value: 8, message: 'Must be at least 8 characters.' },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                    message: 'Must have uppercase, lowercase, and a number.',
                  },
                })}
              />
              <PasswordStrength password={password} />
            </div>

            <Input
              label="Confirm password"
              isPassword
              placeholder="Re-enter your password"
              autoComplete="new-password"
              leftIcon={<Lock size={16} />}
              error={errors.password_confirmation?.message}
              required
              {...register('password_confirmation', {
                required: 'Please confirm your password.',
                validate: val => val === password || 'Passwords do not match.',
              })}
            />

            <Button type="button" fullWidth size="lg" onClick={nextStep}
              rightIcon={<ChevronRight size={18} />}>
              Continue
            </Button>
          </div>
        )}

        {/* ── Step 1: Personal information ─────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-4">
            <Input
              label="Date of birth"
              type="date"
              leftIcon={<Calendar size={16} />}
              error={errors.date_of_birth?.message}
              {...register('date_of_birth', {
                validate: val => !val || new Date(val) < new Date() || 'Date of birth must be in the past.',
              })}
            />

            <Select
              label="Gender"
              placeholder="Select your gender"
              error={errors.gender?.message}
              options={[
                { value: 'male',               label: 'Male'              },
                { value: 'female',             label: 'Female'            },
                { value: 'other',              label: 'Other'             },
                { value: 'prefer_not_to_say',  label: 'Prefer not to say' },
              ]}
              {...register('gender')}
            />

            <Input
              label="Location / City"
              placeholder="e.g. Kigali"
              leftIcon={<MapPin size={16} />}
              error={errors.location?.message}
              {...register('location')}
            />

            <div className="flex gap-3">
              <Button type="button" variant="outline" fullWidth onClick={() => setStep(0)}
                leftIcon={<ChevronLeft size={18} />}>
                Back
              </Button>
              <Button type="button" fullWidth onClick={nextStep}
                rightIcon={<ChevronRight size={18} />}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 2: Emergency contact (optional) ─────────────────────── */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-3">
              Emergency contact details are optional but recommended. You can add or update them later from your profile.
            </p>

            <Input
              label="Emergency contact name"
              placeholder="e.g. Uwimana Claudine"
              leftIcon={<User size={16} />}
              error={errors.emergency_contact_name?.message}
              {...register('emergency_contact_name')}
            />

            <Input
              label="Emergency contact phone"
              type="tel"
              placeholder="+254712345678"
              leftIcon={<Phone size={16} />}
              error={errors.emergency_contact_phone?.message}
              {...register('emergency_contact_phone')}
            />

            <div className="flex gap-3">
              <Button type="button" variant="outline" fullWidth onClick={() => setStep(1)}
                leftIcon={<ChevronLeft size={18} />}>
                Back
              </Button>
              <Button type="submit" fullWidth isLoading={isLoading} size="lg">
                Create account
              </Button>
            </div>

            <p className="text-xs text-gray-400 text-center">
              By creating an account, you agree to our{' '}
              <a href="#" className="underline">Terms of Service</a> and{' '}
              <a href="#" className="underline">Privacy Policy</a>.
            </p>
          </div>
        )}
      </form>
    </AuthLayout>
  )
}
