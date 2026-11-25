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

const DEV_ACCOUNTS = [
  { label: 'Admin',   email: 'admin@tuzamediconnect.rw', password: 'Admin@1234'   },
  { label: 'Staff',   email: 'staff@kigali-clinic.rw',   password: 'Staff@1234'  },
  { label: 'Patient', email: 'jean@example.com',          password: 'Patient@1234' },
]

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: { remember: false },
  })

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null)
    const ok = await login(data)
    if (!ok) setServerError('Invalid email or password. Please try again.')
  }

  const fillAccount = (email: string, password: string) => {
    setValue('email', email)
    setValue('password', password)
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
          })}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-primary-600"
              {...register('remember')}
            />
            Remember me
          </label>
          <span className="text-sm text-gray-400">Forgot password? Contact admin.</span>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading} size="lg">
          Sign in
        </Button>

        {/* Dev quick-fill */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="text-xs text-gray-400 bg-white px-2">Dev accounts</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {DEV_ACCOUNTS.map(acc => (
            <button
              key={acc.label}
              type="button"
              onClick={() => fillAccount(acc.email, acc.password)}
              className="px-2 py-2 text-xs rounded-xl border border-gray-200 text-gray-500 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-colors font-medium"
            >
              {acc.label}
            </button>
          ))}
        </div>

      </form>
    </AuthLayout>
  )
}
