import { useState } from 'react'
import { MessageSquare, Plus, Trash2, Reply, Eye } from 'lucide-react'
import { PatientLayout } from '@/components/layout/PatientLayout'
import { Button } from '@/components/common/Button'
import { Spinner } from '@/components/common/Spinner'
import { EmptyState } from '@/components/common/EmptyState'
import { Badge } from '@/components/common/Badge'
import { ComposeModal } from '@/components/messages/ComposeModal'
import { MessageThreadModal } from '@/components/messages/MessageThreadModal'
import { useInbox } from '@/hooks/useMessages'
import { timeAgo } from '@/utils/formatters'
import { clsx } from 'clsx'
import type { AppMessage } from '@/api/messages'

export default function PatientMessagesPage() {
  const { messages, unreadCount, isLoading, load, deleteMessage } = useInbox()
  const [showCompose,   setShowCompose]   = useState(false)
  const [activeMessage, setActiveMessage] = useState<AppMessage | null>(null)

  return (
    <PatientLayout
      title="Messages"
      subtitle="Communicate directly with your healthcare facilities."
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          {unreadCount > 0 && (
            <Badge color="red">{unreadCount} unread</Badge>
          )}
        </div>
        <Button size="sm" leftIcon={<Plus size={15} />} onClick={() => setShowCompose(true)}>
          New message
        </Button>
      </div>

      {/* Inbox list */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : messages.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<MessageSquare size={24} />}
            title="No messages yet"
            description="Send a message to a healthcare facility to start a conversation."
            action={
              <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowCompose(true)}>
                Send first message
              </Button>
            }
          />
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map(msg => (
            <MessageRow
              key={msg.id}
              message={msg}
              currentUserId={undefined}
              onView={() => setActiveMessage(msg)}
              onDelete={() => deleteMessage(msg.id)}
            />
          ))}
        </div>
      )}

      {/* Compose modal */}
      <ComposeModal
        isOpen={showCompose}
        onClose={() => setShowCompose(false)}
        onSent={load}
      />

      {/* Thread view modal */}
      {activeMessage && (
        <MessageThreadModal
          isOpen={!!activeMessage}
          onClose={() => setActiveMessage(null)}
          message={activeMessage}
          onReplySent={load}
        />
      )}
    </PatientLayout>
  )
}

function MessageRow({ message: m, onView, onDelete }: {
  message: AppMessage
  currentUserId: number | undefined
  onView: () => void
  onDelete: () => void
}) {
  return (
    <div className={clsx(
      'card p-4 flex items-start gap-4 hover:shadow-card-md transition-all cursor-pointer',
      !m.is_read && 'border-l-4 border-l-primary-400 bg-blue-50/20',
    )} onClick={onView}>
      {/* Avatar */}
      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-teal-700 text-sm font-semibold">
          {m.facility?.name?.charAt(0) ?? '?'}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={clsx('text-sm font-semibold text-gray-900 truncate', !m.is_read && 'text-primary-800')}>
            {m.facility?.name ?? 'Unknown facility'}
          </p>
          <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo(m.created_at)}</span>
        </div>
        <p className="text-sm text-gray-700 font-medium truncate mt-0.5">{m.subject}</p>
        <p className="text-xs text-gray-400 truncate mt-0.5">{m.body}</p>

        {/* Reply count */}
        {(m.reply_count ?? 0) > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            <Reply size={11} className="text-gray-400" />
            <span className="text-xs text-gray-400">{m.reply_count} repl{m.reply_count === 1 ? 'y' : 'ies'}</span>
          </div>
        )}
      </div>

      {/* Unread dot */}
      {!m.is_read && (
        <div className="w-2.5 h-2.5 bg-primary-500 rounded-full flex-shrink-0 mt-1.5" />
      )}

      {/* Actions — stop propagation so click doesn't open thread */}
      <div className="flex flex-col gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
        <button onClick={onView}
          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          title="View thread">
          <Eye size={14} />
        </button>
        <button onClick={onDelete}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
