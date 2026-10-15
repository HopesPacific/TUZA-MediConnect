import { useState, useEffect } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight, Stethoscope } from 'lucide-react'
import { FacilityLayout } from '@/components/layout/FacilityLayout'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { Input } from '@/components/common/Input'
import { EmptyState } from '@/components/common/EmptyState'
import { Spinner } from '@/components/common/Spinner'
import { Badge } from '@/components/common/Badge'
import { facilityApi } from '@/api/facility'
import { servicesApi } from '@/api/services'
import toast from 'react-hot-toast'
import type { Service } from '@/types'
import { formatCurrency } from '@/utils/formatters'
import { clsx } from 'clsx'

const categoryEmoji: Record<string, string> = {
  general: '🩺', emergency: '🚨', dental: '🦷', laboratory: '🔬',
  maternal: '🤱', child_health: '👶', vaccination: '💉',
  mental_health: '🧠', pharmacy: '💊',
}

export default function FacilityServicesPage() {
  const [myServices,    setMyServices]    = useState<any[]>([])
  const [allServices,   setAllServices]   = useState<Service[]>([])
  const [isLoading,     setIsLoading]     = useState(true)
  const [showAddModal,  setShowAddModal]  = useState(false)
  const [selectedSvc,   setSelectedSvc]   = useState<Service | null>(null)
  const [price,         setPrice]         = useState('')
  const [duration,      setDuration]      = useState('30')
  const [isSaving,      setIsSaving]      = useState(false)
  const [togglingId,    setTogglingId]    = useState<number | null>(null)

  const loadMyServices = async () => {
    setIsLoading(true)
    try {
      const res = await facilityApi.listServices()
      setMyServices((res.data.data as any) ?? [])
    } catch { setMyServices([]) }
    finally { setIsLoading(false) }
  }

  useEffect(() => {
    loadMyServices()
    servicesApi.getAll().then(r => setAllServices(r.data.data as Service[])).catch(() => {})
  }, [])

  // Services not yet added
  const myServiceIds  = new Set(myServices.map((s: any) => s.id))
  const available     = allServices.filter(s => !myServiceIds.has(s.id))

  const handleAdd = async () => {
    if (!selectedSvc) return
    setIsSaving(true)
    try {
      await facilityApi.addService(selectedSvc.id, {
        price:            price ? Number(price) : undefined,
        duration_minutes: Number(duration),
      })
      toast.success(`${selectedSvc.name} added to your facility.`)
      setShowAddModal(false)
      setSelectedSvc(null)
      setPrice('')
      setDuration('30')
      loadMyServices()
    } catch { toast.error('Failed to add service.') }
    finally { setIsSaving(false) }
  }

  const handleRemove = async (serviceId: number, name: string) => {
    if (!confirm(`Remove "${name}" from your facility?`)) return
    try {
      await facilityApi.removeService(serviceId)
      toast.success(`${name} removed.`)
      loadMyServices()
    } catch { toast.error('Failed to remove service.') }
  }

  const handleToggle = async (serviceId: number) => {
    setTogglingId(serviceId)
    try {
      await facilityApi.toggleService(serviceId)
      loadMyServices()
    } catch { toast.error('Failed to toggle service.') }
    finally { setTogglingId(null) }
  }

  return (
    <FacilityLayout title="Manage Services" subtitle="Control which services your facility offers.">

      <div className="flex justify-end mb-5">
        <Button size="sm" leftIcon={<Plus size={15} />} onClick={() => setShowAddModal(true)}
          disabled={available.length === 0}>
          Add service
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : myServices.length === 0 ? (
        <div className="card">
          <EmptyState icon={<Stethoscope size={24} />} title="No services added yet"
            description="Add services to let patients book appointments at your facility."
            action={<Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowAddModal(true)}>Add first service</Button>} />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {myServices.map((svc: any) => (
            <div key={svc.id} className={clsx('card p-4', !svc.is_available && 'opacity-60')}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{categoryEmoji[svc.category] ?? '🩺'}</span>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{svc.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{svc.category?.replace('_', ' ')}</p>
                  </div>
                </div>
                <Badge color={svc.is_available ? 'green' : 'gray'}>
                  {svc.is_available ? 'Available' : 'Unavailable'}
                </Badge>
              </div>

              <div className="flex items-center gap-4 mb-3 pl-8">
                {svc.price && (
                  <span className="text-sm font-semibold text-primary-700">
                    {formatCurrency(svc.price, svc.currency ?? 'KES')}
                  </span>
                )}
                <span className="text-xs text-gray-400">{svc.duration_minutes ?? 30} min</span>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <button onClick={() => handleToggle(svc.id)}
                  disabled={togglingId === svc.id}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50">
                  {svc.is_available
                    ? <ToggleRight size={15} className="text-green-500" />
                    : <ToggleLeft  size={15} className="text-gray-400" />}
                  {svc.is_available ? 'Disable' : 'Enable'}
                </button>
                <button onClick={() => handleRemove(svc.id, svc.name)}
                  className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors ml-auto">
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add service modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Service" size="md">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Select service <span className="text-red-500">*</span>
            </label>
            <div className="max-h-52 overflow-y-auto space-y-1 border border-gray-200 rounded-xl p-2">
              {available.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">All available services have been added.</p>
              ) : available.map(svc => (
                <button key={svc.id} type="button"
                  onClick={() => setSelectedSvc(svc)}
                  className={clsx('w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors',
                    selectedSvc?.id === svc.id
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'hover:bg-gray-50 text-gray-700')}>
                  <span className="mr-2">{categoryEmoji[svc.category] ?? '🩺'}</span>
                  {svc.name}
                  <span className="text-xs text-gray-400 ml-2 capitalize">{svc.category?.replace('_', ' ')}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Price (KES)" type="number" placeholder="e.g. 1500"
              value={price} onChange={e => setPrice(e.target.value)}
              hint="Leave blank if free / on request" />
            <Input label="Duration (minutes)" type="number"
              value={duration} onChange={e => setDuration(e.target.value)} />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button fullWidth isLoading={isSaving} disabled={!selectedSvc} onClick={handleAdd}>
              Add service
            </Button>
          </div>
        </div>
      </Modal>
    </FacilityLayout>
  )
}
