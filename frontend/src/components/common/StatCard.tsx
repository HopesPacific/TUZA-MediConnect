import { type ReactNode } from 'react'
import { clsx } from 'clsx'

interface StatCardProps {
  label:     string
  value:     number | string
  icon:      ReactNode
  color?:    'blue' | 'green' | 'yellow' | 'purple' | 'teal' | 'red'
  trend?:    string
  className?: string
}

const colorMap = {
  blue:   'bg-blue-50 text-blue-600',
  green:  'bg-green-50 text-green-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  purple: 'bg-purple-50 text-purple-600',
  teal:   'bg-teal-50 text-teal-600',
  red:    'bg-red-50 text-red-600',
}

export function StatCard({ label, value, icon, color = 'blue', trend, className }: StatCardProps) {
  return (
    <div className={clsx('card p-5', className)}>
      <div className="flex items-center justify-between mb-3">
        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', colorMap[color])}>
          {icon}
        </div>
        {trend && <span className="text-xs text-gray-400">{trend}</span>}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}
