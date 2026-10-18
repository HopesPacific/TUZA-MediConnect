import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Calendar, Clock, MapPin, Stethoscope, ArrowLeft,
  XCircle, User, FileText, CreditCard
} from 'lucide-react'
import { PatientLayout } from '@/components/layout/PatientLayout'
import { AppointmentStatusBadge } from '@/components/common/Badge'
import { ConfirmModal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { Alert } from '@/components/common/Alert'
import { Spinner } from '@/components/common/Spinner'
import { PaymentModal } from '@/components/payments/PaymentModal'
import { patientApi } from '@/api/patient'
import { useCancelAppointment } from '@/hooks/useAppointments'
import { formatDate, formatTime, timeAgo } from '@/utils/formatters'
import { clsx } from 'clsx'

interface AppointmentDetail {
  id: number
  appointment_date: string
  appointment_time: string
  reason: string
  status: string
  status_label: string
  status_color: string
  notes: string | null
  rejection_reason: string | null
  reschedule_date: string | null
  reschedule_time: string | null
  reschedule_reason: string | null
  cancellation_reason: string | null
  cancelled_at: string | null
  completed_at: string | null
  can_cancel: boolean
  facility: { id: number; name: string; type: string; location: string; address: string | null; phone: string } | null
  service: { id: number; name: string; category: string; duration_minutes: number; price: number | null; currency: string } | null
  status_history: Array<{
    from_status: string | null
    to_status: string
    to_label: string
    to_color: string
    reason: string | null
    changed_by: string
    changed_at: string
  }>
  created_at: string
}

const statusColors: Record<string, string> = {
  green: 'bg-green-500', blue: 'bg-blue-500', yellow: 'bg-yellow-500',
  purple: 'bg-purple-500', gray: 'bg-gray-400', red: 'bg-red-500',
}

export default function AppointmentDetailPage() {
  const { id }     = useParams<{ id: string }>()
  const navigate   = useNavigate()
  const [appt, setAppt]         = useState<AppointmentDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [showCancel,  setShowCancel]  = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const { cancel, isLoading: isCancelling } = useCancelAppointment()

  const load = async () => {
    if (!id) return
    setIsLoading(true)
    try {
      const res = await patientApi.getAppointment(Number(id))
      setAppt(res.data.data as unknown as AppointmentDetail)
    } catch {
      setError('Appointment not found or you do not have access.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const handleCancel = async () => {
    if (!appt) return
    const ok = await cancel(appt.id)
    if (ok) { setShowCancel(false); load() }
  }

  if (isLoading) return (
    <PatientLayout>
      <div className="flex justify-center py-16"><Spinner size="lg" /></div>
    </PatientLayout>
  )

  if (error || !appt) return (
    <PatientLayout>
      <Alert variant="error" className="mb-4">{error ?? 'Not found.'}</Alert>
      <Button variant="outline" onClick={() => navigate('/patient/appointments')}
        leftIcon={<ArrowLeft size={15} />}>Back to appointments</Button>
    </PatientLayout>
  )

  const displayDate = appt.reschedule_date ?? appt.appointment_date
  const displayTime = appt.reschedule_time ?? appt.appointment_time

  return (
    <PatientLayout title="Appointment Details">
      {/* Back */}
      <div className="mb-5">
        <Link to="/patient/appointments"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft size={15} /> Back to appointments
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Main detail ─────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Header card */}
          <div className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-semibold text-gray-900">
                  {appt.facility?.name ?? 'Healthcare Facility'}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5 capitalize">
                  {appt.facility?.type} · {appt.facility?.location}
                </p>
              </div>
              <AppointmentStatusBadge status={appt.status} />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar size={16} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(displayDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock size={16} className="text-teal-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="text-sm font-semibold text-gray-900">{formatTime(displayTime)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Stethoscope size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Service</p>
                  <p className="text-sm font-semibold text-gray-900">{appt.service?.name ?? '—'}</p>
                </div>
              </div>

              {appt.facility?.phone && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Contact</p>
                    <p className="text-sm font-semibold text-gray-900">{appt.facility.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reason for visit */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2 mb-3">
              <FileText size={15} className="text-gray-400" /> Reason for visit
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{appt.reason}</p>
          </div>

          {/* Rejection reason */}
          {appt.rejection_reason && (
            <Alert variant="error" title="Appointment Rejected">
              {appt.rejection_reason}
            </Alert>
          )}

          {/* Reschedule notice */}
          {appt.status === 'rescheduled' && appt.reschedule_date && (
            <Alert variant="warning" title="Appointment Rescheduled">
              Your appointment has been moved to{' '}
              <strong>{formatDate(appt.reschedule_date)}</strong> at{' '}
              <strong>{formatTime(appt.reschedule_time ?? '')}</strong>.
              {appt.reschedule_reason && ` Reason: ${appt.reschedule_reason}`}
            </Alert>
          )}

          {/* Staff notes */}
          {appt.notes && (
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2 mb-3">
                <User size={15} className="text-gray-400" /> Staff notes
              </h3>
              <p className="text-sm text-gray-600">{appt.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {/* Pay button — shown for confirmed appointments that have a service price */}
            {appt.status === 'confirmed' && appt.service?.price && (
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<CreditCard size={15} />}
                onClick={() => setShowPayment(true)}
              >
                Pay {appt.service.currency} {appt.service.price.toLocaleString()}
              </Button>
            )}

            {appt.can_cancel && (
              <Button variant="danger" size="sm"
                leftIcon={<XCircle size={15} />}
                onClick={() => setShowCancel(true)}>
                Cancel appointment
              </Button>
            )}
          </div>
        </div>

        {/* ── Status History Timeline ──────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-4">Status Timeline</h3>

            {appt.status_history.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No history available.</p>
            ) : (
              <div className="space-y-0">
                {appt.status_history.map((h, i) => (
                  <div key={i} className="flex gap-3">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className={clsx(
                        'w-3 h-3 rounded-full flex-shrink-0 mt-0.5',
                        statusColors[h.to_color] ?? 'bg-gray-400'
                      )} />
                      {i < appt.status_history.length - 1 && (
                        <div className="w-px flex-1 bg-gray-200 my-1" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pb-4 min-w-0">
                      <p className="text-xs font-semibold text-gray-900">{h.to_label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{timeAgo(h.changed_at)}</p>
                      {h.reason && (
                        <p className="text-xs text-gray-500 mt-1 italic">"{h.reason}"</p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">by {h.changed_by}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Appointment meta */}
          <div className="card p-5 mt-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Details</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Booking #</span>
                <span className="font-mono text-gray-700">#{String(appt.id).padStart(6, '0')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Booked on</span>
                <span className="text-gray-700">{formatDate(appt.created_at)}</span>
              </div>
              {appt.service?.duration_minutes && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="text-gray-700">{appt.service.duration_minutes} min</span>
                </div>
              )}
              {appt.service?.price && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated fee</span>
                  <span className="font-semibold text-primary-700">
                    {appt.service.currency} {appt.service.price.toLocaleString()}
                  </span>
                </div>
              )}
              {appt.completed_at && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Completed</span>
                  <span className="text-green-600">{formatDate(appt.completed_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showCancel}
        onClose={() => setShowCancel(false)}
        onConfirm={handleCancel}
        isLoading={isCancelling}
        title="Cancel appointment?"
        message={`Cancel your appointment at ${appt.facility?.name}? This cannot be undone.`}
        confirmLabel="Yes, cancel it"
        variant="danger"
      />

      {/* Payment Modal */}
      {appt.service?.price && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          onSuccess={load}
          appointmentId={appt.id}
          amount={appt.service.price}
          currency={appt.service.currency}
          serviceName={appt.service.name}
          facilityName={appt.facility?.name ?? ''}
        />
      )}
    </PatientLayout>
  )
}
