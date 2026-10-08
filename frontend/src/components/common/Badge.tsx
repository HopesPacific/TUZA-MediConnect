import { clsx } from 'clsx'

type BadgeColor = 'yellow' | 'blue' | 'purple' | 'green' | 'gray' | 'red' | 'teal' | 'orange'

interface BadgeProps {
  color?:    BadgeColor
  children:  React.ReactNode
  dot?:      boolean
  className?: string
}

const colorMap: Record<BadgeColor, string> = {
  yellow: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  blue:   'bg-blue-50 text-blue-800 border-blue-200',
  purple: 'bg-purple-50 text-purple-800 border-purple-200',
  green:  'bg-green-50 text-green-800 border-green-200',
  gray:   'bg-gray-100 text-gray-700 border-gray-200',
  red:    'bg-red-50 text-red-800 border-red-200',
  teal:   'bg-teal-50 text-teal-800 border-teal-200',
  orange: 'bg-orange-50 text-orange-800 border-orange-200',
}

const dotColorMap: Record<BadgeColor, string> = {
  yellow: 'bg-yellow-400',
  blue:   'bg-blue-400',
  purple: 'bg-purple-400',
  green:  'bg-green-400',
  gray:   'bg-gray-400',
  red:    'bg-red-400',
  teal:   'bg-teal-400',
  orange: 'bg-orange-400',
}

export function Badge({ color = 'gray', children, dot, className }: BadgeProps) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
      colorMap[color],
      className,
    )}>
      {dot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full', dotColorMap[color])} />
      )}
      {children}
    </span>
  )
}

// Convenience: appointment status badge
export function AppointmentStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: BadgeColor }> = {
    pending:     { label: 'Pending',     color: 'yellow' },
    confirmed:   { label: 'Confirmed',   color: 'blue'   },
    rescheduled: { label: 'Rescheduled', color: 'purple' },
    completed:   { label: 'Completed',   color: 'green'  },
    cancelled:   { label: 'Cancelled',   color: 'gray'   },
    rejected:    { label: 'Rejected',    color: 'red'    },
  }
  const { label, color } = map[status] ?? { label: status, color: 'gray' as BadgeColor }
  return <Badge color={color} dot>{label}</Badge>
}
