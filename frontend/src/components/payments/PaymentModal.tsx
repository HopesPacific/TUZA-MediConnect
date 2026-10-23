import { useState } from 'react'
import { Smartphone, CreditCard, Building, Banknote, Shield, Info } from 'lucide-react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { Alert } from '@/components/common/Alert'
import { Input } from '@/components/common/Input'
import { useInitiatePayment } from '@/hooks/usePayments'
import { formatCurrency } from '@/utils/formatters'
import { clsx } from 'clsx'
import type { PaymentMethod } from '@/api/payments'

interface PaymentModalProps {
  isOpen:        boolean
  onClose:       () => void
  onSuccess?:    () => void
  appointmentId: number
  amount:        number
  currency?:     string
  serviceName:   string
  facilityName:  string
}

const PAYMENT_METHODS: {
  value:       PaymentMethod
  label:       string
  icon:        React.ReactNode
  hint:        string
  badge?:      string
  badgeColor?: string
}[] = [
  {
    value:       'mpesa',
    label:       'MTN Mobile Money',
    icon:        <Smartphone size={18} />,
    hint:        'Pay via MTN MoMo — enter your MTN number',
    badge:       'Recommended',
    badgeColor:  'bg-yellow-100 text-yellow-700',
  },
  {
    value:       'card',
    label:       'Debit / Credit Card',
    icon:        <CreditCard size={18} />,
    hint:        'Visa or Mastercard',
  },
  {
    value:       'bank_transfer',
    label:       'Bank Transfer',
    icon:        <Building size={18} />,
    hint:        'Direct bank transfer',
  },
  {
    value:       'cash',
    label:       'Pay at Facility',
    icon:        <Banknote size={18} />,
    hint:        'Pay in person when you arrive',
  },
  {
    value:       'insurance',
    label:       'Insurance',
    icon:        <Shield size={18} />,
    hint:        'NHIF, private insurance or corporate scheme',
  },
]

export function PaymentModal({
  isOpen, onClose, onSuccess,
  appointmentId, amount, currency = 'KES', serviceName, facilityName,
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>('mpesa')
  const [phone,          setPhone]          = useState('')
  const { initiate, isLoading }             = useInitiatePayment()

  const isMtn = selectedMethod === 'mpesa'

  const handlePay = async () => {
    if (!selectedMethod) return

    const result = await initiate({
      appointment_id: appointmentId,
      payment_method: selectedMethod,
      amount,
      phone: isMtn ? phone : undefined,
    })

    if (result.success) {
      onSuccess?.()
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Make Payment" size="md">
      <div className="space-y-5">

        {/* Summary */}
        <div className="bg-gradient-to-r from-primary-50 to-teal-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-0.5">{facilityName}</p>
          <p className="font-semibold text-gray-900 text-sm">{serviceName}</p>
          <p className="text-2xl font-bold text-primary-700 mt-1">
            {formatCurrency(amount, currency)}
          </p>
        </div>

        {/* MTN MoMo banner */}
        <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
          <Info size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-yellow-800">
            <p className="font-semibold mb-0.5">MTN Mobile Money Integration</p>
            <p>To use real MTN MoMo payments, configure your API credentials in <code className="bg-yellow-100 px-1 rounded">.env</code>.
            See README for setup instructions. Currently running in <strong>mock mode</strong>.</p>
          </div>
        </div>

        {/* Method selection */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Select payment method</p>
          <div className="space-y-2">
            {PAYMENT_METHODS.map(method => (
              <button key={method.value} type="button"
                onClick={() => setSelectedMethod(method.value)}
                className={clsx(
                  'w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left',
                  selectedMethod === method.value
                    ? 'border-primary-400 bg-primary-50 ring-1 ring-primary-400'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50',
                )}
              >
                {/* Method icon */}
                <div className={clsx(
                  'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                  selectedMethod === method.value
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-500',
                )}>
                  {method.icon}
                </div>

                {/* Label + hint */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{method.label}</p>
                    {method.badge && (
                      <span className={clsx('text-xs px-1.5 py-0.5 rounded-full font-medium', method.badgeColor)}>
                        {method.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{method.hint}</p>
                </div>

                {/* Check indicator */}
                {selectedMethod === method.value && (
                  <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* MTN phone number input */}
        {isMtn && (
          <div className="space-y-3">
            <Input
              label="MTN Mobile Money number"
              type="tel"
              placeholder="+256712345678"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              hint="Enter the registered MTN number. Include country code (e.g. +256 for Uganda)."
              leftIcon={<Smartphone size={15} />}
              required
            />
            <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-1">
              <p className="font-medium text-gray-700">How MTN MoMo payment works:</p>
              <ol className="list-decimal pl-4 space-y-0.5">
                <li>Click "Pay Now" — a payment request is sent to your MTN number</li>
                <li>You receive a USSD prompt on your phone</li>
                <li>Enter your MTN MoMo PIN to approve</li>
                <li>Payment confirmation is sent automatically</li>
              </ol>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button variant="outline" fullWidth onClick={onClose}>Cancel</Button>
          <Button
            fullWidth
            isLoading={isLoading}
            disabled={!selectedMethod || (isMtn && !phone.trim())}
            onClick={handlePay}
          >
            {selectedMethod === 'cash'
              ? 'Confirm (Pay at Facility)'
              : isMtn
              ? 'Send MTN MoMo Request'
              : 'Initiate Payment'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
