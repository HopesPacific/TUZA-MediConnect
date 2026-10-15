import { useState, useEffect, useCallback, useRef } from 'react'
import { notificationsApi, type AppNotification } from '@/api/notifications'
import { useIsAuthenticated } from '@/store/authStore'
import toast from 'react-hot-toast'

/**
 * Manages notifications list with mark-read actions.
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [unreadCount,   setUnreadCount]   = useState(0)
  const [isLoading,     setIsLoading]     = useState(true)
  const [meta,          setMeta]          = useState<{ current_page: number; last_page: number; total: number } | null>(null)

  const load = useCallback(async (page = 1) => {
    setIsLoading(true)
    try {
      const res  = await notificationsApi.getAll({ page, per_page: 15 })
      const data = res.data.data
      setNotifications(Array.isArray(data) ? data : [])
      if ((res.data as any).meta) {
        const m = (res.data as any).meta
        setMeta(m)
        setUnreadCount(m.unread_count ?? 0)
      }
    } catch {
      setNotifications([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const markAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
      setUnreadCount(c => Math.max(0, c - 1))
    } catch {}
  }

  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() })))
      setUnreadCount(0)
      toast.success('All notifications marked as read.')
    } catch {}
  }

  const deleteNotification = async (id: string) => {
    try {
      await notificationsApi.delete(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
      toast.success('Notification deleted.')
    } catch {}
  }

  return { notifications, unreadCount, isLoading, meta, load, markAsRead, markAllAsRead, deleteNotification }
}

/**
 * Polls the unread count every 30 seconds for the notification bell.
 * Only runs when the user is authenticated.
 */
export function useUnreadCount() {
  const [count,         setCount]         = useState(0)
  const isAuthenticated = useIsAuthenticated()
  const intervalRef     = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchCount = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const res = await notificationsApi.getUnreadCount()
      setCount(res.data.data.count)
    } catch {}
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) { setCount(0); return }

    fetchCount()
    intervalRef.current = setInterval(fetchCount, 30_000) // poll every 30s

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isAuthenticated, fetchCount])

  return count
}
