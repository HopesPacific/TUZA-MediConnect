import { useState } from 'react'
import { CreditCard, Smartphone, Building, Banknote, Shield } from 'lucide-react'
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

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: React.ReactNode; hint: string }[] = [
  { value: 'mpesa',         label: 'M-Pesa',         icon: <Smartphone size={18} />,  hint: 'Pay via M-Pesa mobile money' },
  { value: 'card',          label: 'Debit/Credit Card', icon: <CreditCard size={18} />, hint: 'Visa, Mastercard accepted'    },
  { value: 'bank_transfer', label: 'Bank Transfer',   icon: <Building size={18} />,   hint: 'Direct bank transfer'         },
  { value: 'cash',          label: 'Pay at Facility', icon: <Banknote size={18} />,   hint: 'Pay when you arrive'          },
  { value: 'insurance',     label: 'Insurance',       icon: <Shield size={18} />,     hint: 'NHIF or private insurance'    },
]

export function PaymentModal({
  isOpen, onClose, onSuccess,
  appointmentId, amount, currency = 'KES', serviceName, facilityName,
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [phone,          setPhone]          = useState('')
  const { initiate, isLoading }             = useInitiatePayment()

  const handlePay = async () => {
    if (!selectedMethod) return

    const result = await initiate({
      appointment_id: appointmentId,
      payment_method: selectedMethod,
      amount,
      phone: selectedMethod === 'mpesa' ? phone : undefined,
    })

    if (result.success) {
      onSuccess?.()
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Initiate Payment" size="md">
      <div className="space-y-5">
        {/* Summary */}
        <div className="bg-gradient-to-r from-primary-50 to-teal-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">{facilityName}</p>
          <p className="font-semibold text-gray-900">{serviceName}</p>
          <p className="text-2xl font-bold text-primary-700 mt-1">
            {formatCurrency(amount, currency)}
          </p>
        </div>

        {/* Mock notice */}
        <Alert variant="warning" title="Development Mode">
          This is a mock payment — no real money will be processed.
          In production, this connects to a real payment provider.
        </Alert>

        {/* Method selection */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Select payment method</p>
          <div className="space-y-2">
            {PAYMENT_METHODS.map(method => (
              <button
                key={method.value}
                type="button"
                onClick={() => setSelectedMethod(method.value)}
                className={clsx(
                  'w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left',
                  selectedMethod === method.value
                    ? 'border-primary-400 bg-primary-50 ring-1 ring-primary-400'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50',
                )}
              >
                <div className={clsx(
                  'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                  selectedMethod === method.value ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500',
                )}>
                  {method.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{method.label}</p>
                  <p className="text-xs text-gray-500">{method.hint}</p>
                </div>
                {selectedMethod === method.value && (
                  <div className="ml-auto w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* M-Pesa phone input */}
        {selectedMethod === 'mpesa' && (
          <Input
            label="M-Pesa phone number"
            type="tel"
            placeholder="+254712345678"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            hint="Enter the M-Pesa registered phone number"
            leftIcon={<Smartphone size={15} />}
          />
        )}

        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={onClose}>Cancel</Button>
          <Button
            fullWidth
            isLoading={isLoading}
            disabled={!selectedMethod}
            onClick={handlePay}
          >
            {selectedMethod === 'cash' ? 'Confirm (Pay at Facility)' : 'Initiate Payment'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
