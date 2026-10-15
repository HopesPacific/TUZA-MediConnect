import { useState } from 'react'
import { MessageSquare, Reply, Trash2, Eye } from 'lucide-react'
import { FacilityLayout } from '@/components/layout/FacilityLayout'
import { Spinner } from '@/components/common/Spinner'
import { EmptyState } from '@/components/common/EmptyState'
import { Badge } from '@/components/common/Badge'
import { MessageThreadModal } from '@/components/messages/MessageThreadModal'
import { useInbox } from '@/hooks/useMessages'
import { timeAgo } from '@/utils/formatters'
import { clsx } from 'clsx'
import type { AppMessage } from '@/api/messages'

export default function FacilityMessagesPage() {
  const { messages, unreadCount, isLoading, load, deleteMessage } = useInbox()
  const [activeMessage, setActiveMessage] = useState<AppMessage | null>(null)

  return (
    <FacilityLayout
      title="Patient Messages"
      subtitle="Respond to patient inquiries and appointment questions."
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        {unreadCount > 0
          ? <Badge color="red">{unreadCount} unread messages</Badge>
          : <span className="text-sm text-gray-500">All messages</span>
        }
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : messages.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<MessageSquare size={24} />}
            title="No messages"
            description="When patients send you messages, they will appear here."
          />
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map(msg => (
            <FacilityMessageRow
              key={msg.id}
              message={msg}
              onView={() => setActiveMessage(msg)}
              onDelete={() => deleteMessage(msg.id)}
            />
          ))}
        </div>
      )}

      {activeMessage && (
        <MessageThreadModal
          isOpen={!!activeMessage}
          onClose={() => setActiveMessage(null)}
          message={activeMessage}
          onReplySent={load}
        />
      )}
    </FacilityLayout>
  )
}

function FacilityMessageRow({ message: m, onView, onDelete }: {
  message: AppMessage
  onView:  () => void
  onDelete: () => void
}) {
  return (
    <div
      className={clsx(
        'card p-4 flex items-start gap-4 hover:shadow-card-md transition-all cursor-pointer',
        !m.is_read && 'border-l-4 border-l-teal-400 bg-teal-50/20',
      )}
      onClick={onView}
    >
      {/* Patient avatar */}
      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-primary-700 text-sm font-semibold">
          {m.sender?.name?.charAt(0) ?? '?'}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={clsx('text-sm font-semibold text-gray-900', !m.is_read && 'text-teal-800')}>
            {m.sender?.name ?? 'Patient'}
          </p>
          <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo(m.created_at)}</span>
        </div>
        <p className="text-sm text-gray-700 font-medium truncate mt-0.5">{m.subject}</p>
        <p className="text-xs text-gray-400 truncate mt-0.5">{m.body}</p>
        {(m.reply_count ?? 0) > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            <Reply size={11} className="text-gray-400" />
            <span className="text-xs text-gray-400">{m.reply_count} repl{m.reply_count === 1 ? 'y' : 'ies'}</span>
          </div>
        )}
      </div>

      {!m.is_read && (
        <div className="w-2.5 h-2.5 bg-teal-500 rounded-full flex-shrink-0 mt-1.5" />
      )}

      <div className="flex flex-col gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
        <button onClick={onView}
          className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
          title="View & reply">
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
