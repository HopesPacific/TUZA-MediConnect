import { useState, useEffect } from 'react'
import { Send } from 'lucide-react'
import { Modal } from '@/components/common/Modal'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { Select } from '@/components/common/Select'
import { patientApi } from '@/api/patient'
import { useSendMessage } from '@/hooks/useMessages'
import type { Facility } from '@/types'

interface ComposeModalProps {
  isOpen:        boolean
  onClose:       () => void
  onSent?:       () => void
  /** Pre-fill if composing from a facility page */
  facilityId?:   number
  facilityName?: string
  /** Pre-fill for reply */
  parentId?:     number
  subjectPrefix?: string
}

export function ComposeModal({
  isOpen, onClose, onSent,
  facilityId: initialFacilityId,
  facilityName: initialFacilityName,
  parentId, subjectPrefix,
}: ComposeModalProps) {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [facilityId, setFacilityId] = useState<number>(initialFacilityId ?? 0)
  const [subject,    setSubject]    = useState(subjectPrefix ?? '')
  const [body,       setBody]       = useState('')
  const { send, isLoading }         = useSendMessage()

  // Load facilities for the dropdown (if no facility pre-selected)
  useEffect(() => {
    if (initialFacilityId) return
    patientApi.getFacilities({ per_page: 50 })
      .then(r => {
        const payload = r.data.data as any
        setFacilities(Array.isArray(payload) ? payload : payload.data ?? [])
      })
      .catch(() => {})
  }, [initialFacilityId])

  const handleSend = async () => {
    if (!facilityId || !subject.trim() || !body.trim()) return

    const result = await send({
      facility_id: facilityId,
      subject:     subject.trim(),
      body:        body.trim(),
      parent_id:   parentId,
    })

    if (result.success) {
      setSubject('')
      setBody('')
      onSent?.()
      onClose()
    }
  }

  const facilityOptions = facilities.map(f => ({ value: String(f.id), label: f.name }))

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={parentId ? 'Reply to message' : 'New message'} size="md">
      <div className="space-y-4">
        {/* Facility selector — only shown for new messages */}
        {!parentId && (
          initialFacilityId ? (
            <div className="px-3 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-700">
              <span className="text-gray-400 text-xs">To facility: </span>
              <span className="font-medium">{initialFacilityName}</span>
            </div>
          ) : (
            <Select
              label="Send to facility"
              placeholder="Select a facility…"
              options={facilityOptions}
              value={facilityId ? String(facilityId) : ''}
              onChange={e => setFacilityId(Number(e.target.value))}
              required
            />
          )
        )}

        {/* Subject */}
        <Input
          label="Subject"
          placeholder="What is this about?"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          required
        />

        {/* Body */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Write your message here…"
            className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={onClose}>Cancel</Button>
          <Button
            fullWidth
            isLoading={isLoading}
            disabled={!facilityId || !subject.trim() || !body.trim()}
            leftIcon={<Send size={15} />}
            onClick={handleSend}
          >
            Send message
          </Button>
        </div>
      </div>
    </Modal>
  )
}
