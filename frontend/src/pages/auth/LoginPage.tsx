import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Alert } from '@/components/common/Alert'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

interface LoginFormData {
  email:    string
  password: string
  remember: boolean
}

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ defaultValues: { remember: false } })

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null)
    const ok = await login(data)
    if (!ok) setServerError('Invalid email or password. Please try again.')
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Tuza MediConnect account"
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 font-medium hover:underline">
            Create one free
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {serverError && (
          <Alert variant="error" dismissible onDismiss={() => setServerError(null)}>
            {serverError}
          </Alert>
        )}

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
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address.',
            },
          })}
        />

        <Input
          label="Password"
          isPassword
          placeholder="Enter your password"
          autoComplete="current-password"
          leftIcon={<Lock size={16} />}
          error={errors.password?.message}
          required
          {...register('password', {
            required: 'Password is required.',
            minLength: { value: 6, message: 'Password must be at least 6 characters.' },
          })}
        />

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              {...register('remember')}
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-primary-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading} size="lg">
          Sign in
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2">
            Development accounts
          </div>
        </div>

        {/* Quick fill dev credentials */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Admin',   email: 'admin@tuzamediconnect.com', password: 'Admin@1234'   },
            { label: 'Staff',   email: 'staff@nairobi-clinic.com',   password: 'Staff@1234'  },
            { label: 'Patient', email: 'john@example.com',           password: 'Patient@1234' },
          ].map(acc => (
            <button
              key={acc.label}
              type="button"
              onClick={() => {
                const emailInput = document.querySelector<HTMLInputElement>('#email_address')
                const passInput  = document.querySelector<HTMLInputElement>('#password')
                if (emailInput) { emailInput.value = acc.email; emailInput.dispatchEvent(new Event('input', { bubbles: true })) }
                if (passInput)  { passInput.value  = acc.password; passInput.dispatchEvent(new Event('input', { bubbles: true })) }
              }}
              className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-primary-300 transition-colors"
            >
              {acc.label}
            </button>
          ))}
        </div>
      </form>
    </AuthLayout>
  )
}
