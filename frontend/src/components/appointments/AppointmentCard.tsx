import { useState } from 'react'
import { Calendar, Clock, MapPin, Stethoscope, XCircle, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppointmentStatusBadge } from '@/components/common/Badge'
import { ConfirmModal } from '@/components/common/Modal'
import { useCancelAppointment } from '@/hooks/useAppointments'
import { formatDate, formatTime } from '@/utils/formatters'
import type { Appointment } from '@/types'

interface AppointmentCardProps {
  appointment: Appointment
  onCancelled?: () => void
  compact?:     boolean
}

export function AppointmentCard({ appointment, onCancelled, compact }: AppointmentCardProps) {
  const [showCancel, setShowCancel] = useState(false)
  const { cancel, isLoading }       = useCancelAppointment()

  const handleCancel = async () => {
    const ok = await cancel(appointment.id)
    if (ok) {
      setShowCancel(false)
      onCancelled?.()
    }
  }

  const date = appointment.reschedule_date ?? appointment.appointment_date
  const time = appointment.reschedule_time ?? appointment.appointment_time

  return (
    <>
      <div className="card p-4 hover:shadow-card-md transition-shadow">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">
              {appointment.facility?.name ?? '—'}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <Stethoscope size={11} />
              {appointment.service?.name ?? '—'}
            </p>
          </div>
          <AppointmentStatusBadge status={appointment.status} />
        </div>

        {/* Date / Time / Location */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3">
          <span className="flex items-center gap-1.5 text-xs text-gray-600">
            <Calendar size={12} className="text-primary-500" />
            {formatDate(date)}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-600">
            <Clock size={12} className="text-primary-500" />
            {formatTime(time)}
          </span>
          {appointment.facility?.location && (
            <span className="flex items-center gap-1.5 text-xs text-gray-600">
              <MapPin size={12} className="text-primary-500" />
              {appointment.facility.location}
            </span>
          )}
        </div>

        {/* Reason — truncated */}
        {!compact && appointment.reason && (
          <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-3 line-clamp-2">
            {appointment.reason}
          </p>
        )}

        {/* Rejection / cancellation reason */}
        {appointment.rejection_reason && (
          <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">
            Rejected: {appointment.rejection_reason}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <Link
            to={`/patient/appointments/${appointment.id}`}
            className="text-xs text-primary-600 font-medium flex items-center gap-1 hover:gap-1.5 transition-all"
          >
            View details <ChevronRight size={13} />
          </Link>

          {appointment.can_cancel && (
            <button
              onClick={() => setShowCancel(true)}
              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
            >
              <XCircle size={13} />
              Cancel
            </button>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showCancel}
        onClose={() => setShowCancel(false)}
        onConfirm={handleCancel}
        isLoading={isLoading}
        title="Cancel appointment?"
        message={`Are you sure you want to cancel your appointment at ${appointment.facility?.name}? This action cannot be undone.`}
        confirmLabel="Yes, cancel it"
        variant="danger"
      />
    </>
  )
}
