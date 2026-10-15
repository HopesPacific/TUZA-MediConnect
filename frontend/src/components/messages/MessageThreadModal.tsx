import { useState, useEffect } from 'react'
import { Send, User } from 'lucide-react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { Spinner } from '@/components/common/Spinner'
import { messagesApi, type AppMessage } from '@/api/messages'
import { useSendMessage } from '@/hooks/useMessages'
import { useCurrentUser } from '@/store/authStore'
import { timeAgo } from '@/utils/formatters'
import { clsx } from 'clsx'

interface MessageThreadModalProps {
  isOpen:     boolean
  onClose:    () => void
  message:    AppMessage
  onReplySent?: () => void
}

export function MessageThreadModal({ isOpen, onClose, message, onReplySent }: MessageThreadModalProps) {
  const [thread,    setThread]    = useState<AppMessage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [replyBody, setReplyBody] = useState('')
  const { send, isLoading: isSending } = useSendMessage()
  const currentUser = useCurrentUser()

  useEffect(() => {
    if (!isOpen) return
    setIsLoading(true)
    messagesApi.getMessage(message.id)
      .then(r => setThread(r.data.data))
      .catch(() => setThread(message))
      .finally(() => setIsLoading(false))
  }, [isOpen, message.id])

  const handleReply = async () => {
    if (!replyBody.trim() || !thread) return

    const result = await send({
      facility_id: thread.facility.id,
      subject:     `Re: ${thread.subject}`,
      body:        replyBody.trim(),
      parent_id:   thread.id,
    })

    if (result.success) {
      setReplyBody('')
      // Reload the thread
      messagesApi.getMessage(message.id)
        .then(r => setThread(r.data.data))
        .catch(() => {})
      onReplySent?.()
    }
  }

  const allMessages = thread
    ? [thread, ...(thread.replies ?? [])]
    : []

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg"
      title={thread?.subject ?? message.subject}>
      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : (
        <div className="space-y-4">
          {/* Facility badge */}
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <span className="text-teal-700 text-xs font-bold">
                {thread?.facility?.name?.charAt(0) ?? '?'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{thread?.facility?.name}</p>
              <p className="text-xs text-gray-400">{allMessages.length} message{allMessages.length !== 1 ? 's' : ''} in thread</p>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {allMessages.map((msg, i) => {
              const isMine = msg.sender?.id === currentUser?.id
              return (
                <div key={msg.id} className={clsx('flex gap-3', isMine && 'flex-row-reverse')}>
                  {/* Avatar */}
                  <div className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold',
                    isMine ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600',
                  )}>
                    {msg.sender?.name?.charAt(0) ?? <User size={14} />}
                  </div>

                  {/* Bubble */}
                  <div className={clsx(
                    'max-w-xs lg:max-w-sm rounded-2xl px-4 py-3',
                    isMine
                      ? 'bg-primary-600 text-white rounded-tr-sm'
                      : 'bg-gray-100 text-gray-900 rounded-tl-sm',
                  )}>
                    <p className={clsx('text-xs font-medium mb-1', isMine ? 'text-primary-200' : 'text-gray-500')}>
                      {msg.sender?.name}
                    </p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                    <p className={clsx('text-xs mt-1.5', isMine ? 'text-primary-300' : 'text-gray-400')}>
                      {timeAgo(msg.created_at)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Reply box */}
          <div className="pt-3 border-t border-gray-100">
            <div className="flex gap-3 items-end">
              <textarea
                rows={3}
                value={replyBody}
                onChange={e => setReplyBody(e.target.value)}
                placeholder="Write a reply…"
                className="flex-1 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyDown={e => {
                  // Ctrl+Enter to send
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleReply()
                }}
              />
              <Button
                onClick={handleReply}
                isLoading={isSending}
                disabled={!replyBody.trim()}
                leftIcon={<Send size={14} />}
                size="sm"
              >
                Reply
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-1.5">Press Ctrl+Enter to send</p>
          </div>
        </div>
      )}
    </Modal>
  )
}
