import { Bell, CheckCheck, Trash2, Check } from 'lucide-react'
import { PatientLayout } from '@/components/layout/PatientLayout'
import { Spinner } from '@/components/common/Spinner'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/common/Button'
import { useNotifications } from '@/hooks/useNotifications'
import { timeAgo } from '@/utils/formatters'
import { clsx } from 'clsx'

const typeIcon: Record<string, string> = {
  appointment_requested:   '📋',
  appointment_confirmed:   '✅',
  appointment_rejected:    '❌',
  appointment_rescheduled: '🔄',
  appointment_cancelled:   '🚫',
  appointment_reminder:    '⏰',
  message_received:        '💬',
  general:                 '🔔',
}

export default function NotificationsPage() {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, deleteNotification } = useNotifications()

  return (
    <PatientLayout
      title="Notifications"
      subtitle="Stay up to date with your appointments and messages."
    >
      {/* Header actions */}
      {unreadCount > 0 && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">{unreadCount} unread</p>
          <Button variant="ghost" size="sm" leftIcon={<CheckCheck size={15} />}
            onClick={markAllAsRead}>
            Mark all as read
          </Button>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : notifications.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<Bell size={24} />}
            title="No notifications"
            description="You're all caught up! Notifications about your appointments will appear here."
          />
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id}
              className={clsx(
                'card p-4 flex items-start gap-4 transition-all',
                !n.is_read && 'border-l-4 border-l-primary-400 bg-blue-50/30',
              )}>
              {/* Icon */}
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                {typeIcon[n.type] ?? '🔔'}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={clsx(
                    'text-sm font-semibold leading-snug',
                    !n.is_read ? 'text-primary-900' : 'text-gray-900'
                  )}>
                    {n.title}
                  </p>
                  {!n.is_read && (
                    <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1.5">{timeAgo(n.created_at)}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                {!n.is_read && (
                  <button onClick={() => markAsRead(n.id)}
                    title="Mark as read"
                    className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Check size={14} />
                  </button>
                )}
                <button onClick={() => deleteNotification(n.id)}
                  title="Delete"
                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PatientLayout>
  )
}
