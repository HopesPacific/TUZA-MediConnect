import { useState, useEffect, useCallback } from 'react'
import { messagesApi, type AppMessage, type SendMessageData } from '@/api/messages'
import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'
import type { ApiError } from '@/types'

export function useInbox() {
  const [messages,    setMessages]    = useState<AppMessage[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading,   setIsLoading]   = useState(true)
  const [meta,        setMeta]        = useState<{ total: number; last_page: number; current_page: number } | null>(null)

  const load = useCallback(async (page = 1) => {
    setIsLoading(true)
    try {
      const res     = await messagesApi.getInbox({ page, per_page: 15 })
      const payload = res.data.data
      setMessages(Array.isArray(payload) ? payload : [])
      if ((res.data as any).meta) {
        const m = (res.data as any).meta
        setMeta(m)
        setUnreadCount(m.unread_count ?? 0)
      }
    } catch {
      setMessages([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const deleteMessage = async (id: number) => {
    try {
      await messagesApi.delete(id)
      setMessages(prev => prev.filter(m => m.id !== id))
      toast.success('Message deleted.')
    } catch {
      toast.error('Could not delete message.')
    }
  }

  return { messages, unreadCount, isLoading, meta, load, deleteMessage }
}

export function useSendMessage() {
  const [isLoading, setIsLoading] = useState(false)

  const send = async (data: SendMessageData): Promise<{ success: boolean; message?: AppMessage }> => {
    setIsLoading(true)
    try {
      const res = await messagesApi.send(data)
      toast.success('Message sent.')
      return { success: true, message: res.data.data }
    } catch (err) {
      const e = err as AxiosError<ApiError>
      toast.error(e.response?.data?.message ?? 'Failed to send message.')
      return { success: false }
    } finally {
      setIsLoading(false)
    }
  }

  return { send, isLoading }
}
