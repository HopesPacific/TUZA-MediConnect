import { useState } from 'react'
import { CreditCard, CheckCircle, Clock, RefreshCw } from 'lucide-react'
import { PatientLayout } from '@/components/layout/PatientLayout'
import { StatCard } from '@/components/common/StatCard'
import { Badge } from '@/components/common/Badge'
import { Spinner } from '@/components/common/Spinner'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/common/Button'
import { Alert } from '@/components/common/Alert'
import { usePayments, useVerifyPayment } from '@/hooks/usePayments'
import { formatCurrency, formatDate, formatDateTime } from '@/utils/formatters'
import type { AppPayment } from '@/api/payments'
import { clsx } from 'clsx'

const statusColors: Record<string, 'green' | 'yellow' | 'red' | 'gray' | 'blue'> = {
  successful: 'green',
  pending:    'yellow',
  failed:     'red',
  cancelled:  'gray',
  refunded:   'blue',
}

const methodIcons: Record<string, string> = {
  mpesa:         '📱',
  card:          '💳',
  bank_transfer: '🏦',
  cash:          '💵',
  insurance:     '🛡️',
}

export default function PaymentsPage() {
  const { payments, stats, isLoading, refetch } = usePayments()
  const { verify, isLoading: isVerifying }       = useVerifyPayment()
  const [verifyingId, setVerifyingId]            = useState<number | null>(null)

  const handleVerify = async (payment: AppPayment) => {
    setVerifyingId(payment.id)
    await verify(payment.id, refetch)
    setVerifyingId(null)
  }

  return (
    <PatientLayout
      title="Payment History"
      subtitle="View and manage your appointment payment records."
    >
      {/* Mock notice */}
      <Alert variant="info" dismissible className="mb-5">
        <strong>Mock Payment System</strong> — Payments are simulated for demonstration.
        No real transactions are processed. This architecture is ready for M-Pesa, Stripe, or other providers.
      </Alert>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <StatCard
            label="Total Paid"
            value={formatCurrency(stats.total_paid, stats.currency)}
            icon={<CheckCircle size={18} />}
            color="green"
          />
          <StatCard
            label="Pending Payments"
            value={stats.pending_count}
            icon={<Clock size={18} />}
            color="yellow"
          />
          <StatCard
            label="Total Transactions"
            value={stats.total_count}
            icon={<CreditCard size={18} />}
            color="blue"
          />
        </div>
      )}

      {/* Payment list */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : payments.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<CreditCard size={24} />}
            title="No payments yet"
            description="Your payment history will appear here once you initiate a payment for an appointment."
          />
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map(payment => (
            <PaymentRow
              key={payment.id}
              payment={payment}
              isVerifying={verifyingId === payment.id}
              onVerify={() => handleVerify(payment)}
            />
          ))}
        </div>
      )}
    </PatientLayout>
  )
}

function PaymentRow({ payment: p, isVerifying, onVerify }: {
  payment:    AppPayment
  isVerifying: boolean
  onVerify:   () => void
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        {/* Left — method icon + details */}
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
            {methodIcons[p.payment_method] ?? '💰'}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900">
              {p.appointment?.service_name ?? 'Payment'}
            </p>
            {p.appointment && (
              <p className="text-sm text-gray-500 mt-0.5">
                {p.appointment.facility_name} · {formatDate(p.appointment.appointment_date)}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge color={statusColors[p.status] ?? 'gray'}>{p.status_label}</Badge>
              <span className="text-xs text-gray-400 capitalize">
                {p.payment_method.replace('_', ' ')}
              </span>
              {p.provider && (
                <span className={clsx(
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  p.provider === 'mock'
                    ? 'bg-orange-100 text-orange-600'
                    : 'bg-green-100 text-green-600'
                )}>
                  {p.provider === 'mock' ? 'Mock' : p.provider}
                </span>
              )}
            </div>
            {p.transaction_ref && (
              <p className="text-xs text-gray-400 mt-1 font-mono">Ref: {p.transaction_ref}</p>
            )}
            {p.failure_reason && (
              <p className="text-xs text-red-500 mt-1">{p.failure_reason}</p>
            )}
          </div>
        </div>

        {/* Right — amount + actions */}
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(p.amount, p.currency)}
          </p>
          {p.paid_at && (
            <p className="text-xs text-green-600 mt-0.5">{formatDate(p.paid_at)}</p>
          )}
          {!p.paid_at && (
            <p className="text-xs text-gray-400 mt-0.5">{formatDate(p.created_at)}</p>
          )}

          {/* Verify button for pending payments */}
          {p.status === 'pending' && p.transaction_ref && (
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              isLoading={isVerifying}
              leftIcon={<RefreshCw size={13} />}
              onClick={onVerify}
            >
              Verify
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
