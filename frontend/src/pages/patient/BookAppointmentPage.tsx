import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Building2, Stethoscope, Calendar, Clock, FileText, ChevronRight } from 'lucide-react'
import { PatientLayout } from '@/components/layout/PatientLayout'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { Alert } from '@/components/common/Alert'
import { Spinner } from '@/components/common/Spinner'
import { patientApi } from '@/api/patient'
import { useBookAppointment } from '@/hooks/useAppointments'
import type { Facility, Service } from '@/types'
import { formatCurrency } from '@/utils/formatters'
import { clsx } from 'clsx'

interface BookingForm {
  facility_id:      number
  service_id:       number
  appointment_date: string
  appointment_time: string
  reason:           string
}

export default function BookAppointmentPage() {
  const navigate     = useNavigate()
  const [params]     = useSearchParams()
  const { book, isLoading: isBooking } = useBookAppointment()

  const [step,       setStep]       = useState(0)  // 0=facility 1=service 2=datetime 3=confirm
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [search,     setSearch]     = useState('')
  const [slots,      setSlots]      = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const [selectedService,  setSelectedService]  = useState<Service  | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingForm>({
    defaultValues: { facility_id: params.get('facility') ? Number(params.get('facility')) : 0 },
  })

  const watchDate = watch('appointment_date')
  const watchFacilityId = watch('facility_id')

  // Load facilities
  useEffect(() => {
    patientApi.getFacilities({ search, per_page: 20 })
      .then(r => {
        const payload = r.data.data as any
        setFacilities(Array.isArray(payload) ? payload : payload.data ?? [])
      })
      .catch(() => {})
  }, [search])

  // Load slots when date + facility selected
  useEffect(() => {
    if (!watchFacilityId || !watchDate) return
    setLoadingSlots(true)
    setSlots([])
    patientApi.getAvailableSlots(watchFacilityId, watchDate)
      .then(r => setSlots(r.data.data.slots))
      .catch(() => {})
      .finally(() => setLoadingSlots(false))
  }, [watchFacilityId, watchDate])

  const onSubmit = async (data: BookingForm) => {
    setServerError(null)
    const result = await book(data)
    if (result.success) {
      navigate('/patient/appointments')
    } else {
      setServerError(result.error ?? 'Booking failed.')
    }
  }

  const STEPS = ['Facility', 'Service', 'Date & Time', 'Confirm']

  const StepBar = () => (
    <div className="flex items-center mb-6 overflow-x-auto pb-1">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center flex-shrink-0">
          <div className={clsx(
            'flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold',
            i < step  ? 'bg-primary-600 text-white' :
            i === step ? 'bg-primary-600 text-white ring-4 ring-primary-100' :
                        'bg-gray-200 text-gray-500'
          )}>
            {i < step ? '✓' : i + 1}
          </div>
          <span className={clsx(
            'text-xs ml-1.5 font-medium',
            i === step ? 'text-primary-600' : 'text-gray-400'
          )}>{label}</span>
          {i < STEPS.length - 1 && <div className="w-8 h-px bg-gray-200 mx-2" />}
        </div>
      ))}
    </div>
  )

  return (
    <PatientLayout title="Book Appointment" subtitle="Find a facility and schedule your visit.">
      <div className="max-w-2xl">
        <StepBar />

        <form onSubmit={handleSubmit(onSubmit)}>
          {serverError && <Alert variant="error" className="mb-4">{serverError}</Alert>}

          {/* ── Step 0: Select Facility ──────────────────────────────────── */}
          {step === 0 && (
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 size={18} className="text-primary-600" /> Select a facility
              </h2>
              <input
                type="text"
                placeholder="Search by name or location…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {facilities.length === 0
                ? <div className="text-center py-8 text-gray-400"><Spinner className="mx-auto mb-2" /> Loading…</div>
                : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {facilities.map(f => (
                      <button key={f.id} type="button"
                        onClick={() => {
                          setValue('facility_id', f.id)
                          setSelectedFacility(f)
                          setSelectedService(null)
                          setValue('service_id', 0)
                          setStep(1)
                        }}
                        className={clsx(
                          'w-full text-left p-4 rounded-xl border transition-colors',
                          watchFacilityId === f.id
                            ? 'border-primary-400 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm text-gray-900">{f.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{f.location} · {f.type}</p>
                          </div>
                          {f.is_verified && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )
              }
            </div>
          )}

          {/* ── Step 1: Select Service ───────────────────────────────────── */}
          {step === 1 && selectedFacility && (
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                <Stethoscope size={18} className="text-primary-600" /> Select a service
              </h2>
              <p className="text-xs text-gray-500 mb-4">{selectedFacility.name}</p>

              {(!selectedFacility.services || selectedFacility.services.length === 0) ? (
                <p className="text-sm text-gray-500 text-center py-8">No services available at this facility.</p>
              ) : (
                <div className="space-y-2">
                  {selectedFacility.services.map((svc: any) => (
                    <button key={svc.id} type="button"
                      onClick={() => {
                        setValue('service_id', svc.id)
                        setSelectedService(svc)
                        setStep(2)
                      }}
                      className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm text-gray-900">{svc.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5 capitalize">{svc.category?.replace('_', ' ')}</p>
                        </div>
                        <div className="text-right">
                          {svc.price && <p className="text-sm font-semibold text-primary-700">{formatCurrency(svc.price, svc.currency)}</p>}
                          {svc.duration_minutes && <p className="text-xs text-gray-400">{svc.duration_minutes} min</p>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <button type="button" onClick={() => setStep(0)}
                className="mt-4 text-xs text-gray-500 hover:text-gray-700">← Change facility</button>
            </div>
          )}

          {/* ── Step 2: Date & Time ──────────────────────────────────────── */}
          {step === 2 && (
            <div className="card p-5 space-y-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar size={18} className="text-primary-600" /> Choose date & time
              </h2>

              <Input
                label="Appointment date"
                type="date"
                leftIcon={<Calendar size={16} />}
                error={errors.appointment_date?.message}
                required
                min={new Date().toISOString().split('T')[0]}
                {...register('appointment_date', { required: 'Please select a date.' })}
              />

              {watchDate && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Available time slots <span className="text-red-500">*</span>
                  </label>
                  {loadingSlots ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500 py-3">
                      <Spinner size="sm" /> Loading available slots…
                    </div>
                  ) : slots.length === 0 ? (
                    <p className="text-sm text-gray-500 py-3">No available slots for this date.</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {slots.map(slot => (
                        <label key={slot} className="cursor-pointer">
                          <input type="radio" value={slot} className="sr-only peer"
                            {...register('appointment_time', { required: 'Please select a time.' })} />
                          <div className={clsx(
                            'text-center py-2 rounded-lg border text-sm font-medium transition-colors',
                            'peer-checked:bg-primary-600 peer-checked:text-white peer-checked:border-primary-600',
                            'hover:border-primary-400 border-gray-200',
                          )}>
                            {slot}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                  {errors.appointment_time && (
                    <p className="text-xs text-red-600 mt-1">{errors.appointment_time.message}</p>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>← Back</Button>
                <Button type="button" onClick={() => setStep(3)} rightIcon={<ChevronRight size={16} />}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 3: Reason + Confirm ─────────────────────────────────── */}
          {step === 3 && (
            <div className="card p-5 space-y-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText size={18} className="text-primary-600" /> Confirm booking
              </h2>

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Facility</span>
                  <span className="font-medium">{selectedFacility?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Service</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{watch('appointment_date')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className="font-medium">{watch('appointment_time')}</span>
                </div>
              </div>

              {/* Reason */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Reason for visit <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Briefly describe the reason for this appointment (minimum 10 characters)…"
                  className={clsx(
                    'w-full border rounded-xl px-3.5 py-2.5 text-sm resize-none',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500',
                    errors.reason ? 'border-red-400' : 'border-gray-300'
                  )}
                  {...register('reason', {
                    required: 'Please describe your reason for the appointment.',
                    minLength: { value: 10, message: 'Please provide at least 10 characters.' },
                  })}
                />
                {errors.reason && <p className="text-xs text-red-600">{errors.reason.message}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>← Back</Button>
                <Button type="submit" fullWidth isLoading={isBooking} size="lg">
                  Confirm booking
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </PatientLayout>
  )
}
