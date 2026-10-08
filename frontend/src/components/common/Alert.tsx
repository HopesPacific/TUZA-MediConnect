import { clsx } from 'clsx'
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react'
import { useState } from 'react'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

interface AlertProps {
  variant?:    AlertVariant
  title?:      string
  children:    React.ReactNode
  dismissible?: boolean
  onDismiss?:  () => void
  className?:  string
}

const variantMap = {
  info:    { bg: 'bg-blue-50 border-blue-200',   text: 'text-blue-800',  Icon: Info         },
  success: { bg: 'bg-green-50 border-green-200', text: 'text-green-800', Icon: CheckCircle  },
  warning: { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-800', Icon: AlertCircle },
  error:   { bg: 'bg-red-50 border-red-200',     text: 'text-red-800',   Icon: XCircle      },
}

export function Alert({ variant = 'info', title, children, dismissible, onDismiss, className }: AlertProps) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  const { bg, text, Icon } = variantMap[variant]

  return (
    <div role="alert" className={clsx(
      'flex gap-3 p-4 rounded-xl border text-sm',
      bg, text, className,
    )}>
      <Icon size={18} className="flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div>{children}</div>
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className={clsx('flex-shrink-0 hover:opacity-70 transition-opacity', text)}
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
