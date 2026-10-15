import { useState, useRef, useEffect } from 'react'
import { Bell, X, Check, CheckCheck, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { clsx } from 'clsx'
import { useUnreadCount, useNotifications } from '@/hooks/useNotifications'
import { timeAgo } from '@/utils/formatters'

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

export function NotificationBell() {
  const [open, setOpen]   = useState(false)
  const dropRef           = useRef<HTMLDivElement>(null)
  const unreadCount       = useUnreadCount()
  const { notifications, isLoading, markAsRead, markAllAsRead, deleteNotification } = useNotifications()

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleOpen = () => setOpen(v => !v)

  return (
    <div className="relative" ref={dropRef}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-card-lg border border-gray-100 z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-700 text-xs font-semibold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck size={15} />
                </button>
              )}
              <button onClick={() => setOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                <X size={15} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {isLoading ? (
              <div className="py-8 text-center text-sm text-gray-400">Loading…</div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-2xl mb-2">🔔</p>
                <p className="text-sm text-gray-500">No notifications yet</p>
              </div>
            ) : (
              notifications.slice(0, 8).map(n => (
                <div
                  key={n.id}
                  className={clsx(
                    'flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group',
                    !n.is_read && 'bg-blue-50/40'
                  )}
                >
                  <span className="text-lg flex-shrink-0 mt-0.5">{typeIcon[n.type] ?? '🔔'}</span>
                  <div className="flex-1 min-w-0">
                    <p className={clsx('text-xs font-semibold text-gray-900 leading-snug', !n.is_read && 'text-primary-800')}>
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                  </div>
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    {!n.is_read && (
                      <button onClick={() => markAsRead(n.id)}
                        className="p-1 text-blue-400 hover:text-blue-600 rounded transition-colors"
                        title="Mark as read">
                        <Check size={12} />
                      </button>
                    )}
                    <button onClick={() => deleteNotification(n.id)}
                      className="p-1 text-gray-300 hover:text-red-500 rounded transition-colors"
                      title="Delete">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100">
              <Link
                to="/patient/notifications"
                onClick={() => setOpen(false)}
                className="text-xs text-primary-600 font-medium hover:underline"
              >
                View all notifications →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
