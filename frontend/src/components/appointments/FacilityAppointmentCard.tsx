import { useState } from 'react'
import { Calendar, Clock, User, Phone, Stethoscope, CheckCircle, XCircle, RotateCcw, Check } from 'lucide-react'
import { AppointmentStatusBadge } from '@/components/common/Badge'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { formatDate, formatTime } from '@/utils/formatters'
import type { FacilityAppointment } from '@/api/facility'
import { clsx } from 'clsx'

interface FacilityAppointmentCardProps {
  appointment: FacilityAppointment
  onConfirm:    (id: number) => void
  onReject:     (id: number, reason: string) => void
  onReschedule: (id: number, date: string, time: string, reason?: string) => void
  onComplete:   (id: number) => void
  loadingId:    number | null
}

export function FacilityAppointmentCard({
  appointment: a, onConfirm, onReject, onReschedule, onComplete, loadingId
}: FacilityAppointmentCardProps) {
  const [showReject,      setShowReject]      = useState(false)
  const [showReschedule,  setShowReschedule]  = useState(false)
  const [rejectReason,    setRejectReason]    = useState('')
  const [rescheduleDate,  setRescheduleDate]  = useState('')
  const [rescheduleTime,  setRescheduleTime]  = useState('')
  const [rescheduleReason, setRescheduleReason] = useState('')
  const isLoading = loadingId === a.id

  const isPending    = a.status === 'pending'
  const isConfirmed  = a.status === 'confirmed'

  const handleReject = () => {
    if (!rejectReason.trim()) return
    onReject(a.id, rejectReason)
    setShowReject(false)
    setRejectReason('')
  }

  const handleReschedule = () => {
    if (!rescheduleDate || !rescheduleTime) return
    onReschedule(a.id, rescheduleDate, rescheduleTime, rescheduleReason)
    setShowReschedule(false)
  }

  return (
    <>
      <div className={clsx('card p-4', isLoading && 'opacity-60')}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-700 text-sm font-semibold">{a.patient.name.charAt(0)}</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{a.patient.name}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Phone size={10} /> {a.patient.phone}
              </p>
            </div>
          </div>
          <AppointmentStatusBadge status={a.status} />
        </div>

        {/* Details */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3 pl-11">
          <span className="flex items-center gap-1.5 text-xs text-gray-600">
            <Stethoscope size={11} className="text-teal-500" /> {a.service?.name}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-600">
            <Calendar size={11} className="text-teal-500" /> {formatDate(a.appointment_date)}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-600">
            <Clock size={11} className="text-teal-500" /> {formatTime(a.appointment_time)}
          </span>
        </div>

        {/* Reason */}
        <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-3 ml-11 line-clamp-2">
          {a.reason}
        </p>

        {/* Staff action buttons */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 pl-11">
          {isPending && (
            <>
              <button onClick={() => onConfirm(a.id)} disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50">
                <CheckCircle size={13} /> Confirm
              </button>
              <button onClick={() => setShowReject(true)} disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50">
                <XCircle size={13} /> Reject
              </button>
              <button onClick={() => setShowReschedule(true)} disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50">
                <RotateCcw size={13} /> Reschedule
              </button>
            </>
          )}
          {isConfirmed && (
            <>
              <button onClick={() => onComplete(a.id)} disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50">
                <Check size={13} /> Mark Completed
              </button>
              <button onClick={() => setShowReschedule(true)} disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50">
                <RotateCcw size={13} /> Reschedule
              </button>
            </>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      <Modal isOpen={showReject} onClose={() => setShowReject(false)} title="Reject Appointment" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            You are rejecting {a.patient.name}'s appointment. Please provide a reason.
          </p>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Reason <span className="text-red-500">*</span></label>
            <textarea rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g. Slot no longer available, facility closed…"
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setShowReject(false)}>Cancel</Button>
            <Button variant="danger" fullWidth onClick={handleReject} disabled={!rejectReason.trim()}>
              Reject appointment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reschedule Modal */}
      <Modal isOpen={showReschedule} onClose={() => setShowReschedule(false)} title="Reschedule Appointment" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Set a new date and time for {a.patient.name}'s appointment.</p>
          <Input label="New date" type="date"
            min={new Date().toISOString().split('T')[0]}
            value={rescheduleDate} onChange={e => setRescheduleDate(e.target.value)} />
          <Input label="New time" type="time"
            value={rescheduleTime} onChange={e => setRescheduleTime(e.target.value)} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Reason (optional)</label>
            <textarea rows={2} value={rescheduleReason} onChange={e => setRescheduleReason(e.target.value)}
              placeholder="Reason for rescheduling…"
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setShowReschedule(false)}>Cancel</Button>
            <Button fullWidth onClick={handleReschedule} disabled={!rescheduleDate || !rescheduleTime}>
              Reschedule
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
