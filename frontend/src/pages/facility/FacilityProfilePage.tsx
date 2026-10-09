import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Building2, Phone, Mail, MapPin, Globe, Clock, Save } from 'lucide-react'
import { FacilityLayout } from '@/components/layout/FacilityLayout'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { Alert } from '@/components/common/Alert'
import { Badge } from '@/components/common/Badge'
import { facilityApi } from '@/api/facility'
import toast from 'react-hot-toast'

interface FacilityForm {
  name:        string
  description: string
  phone:       string
  email:       string
  website:     string
  address:     string
  location:    string
}

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] as const

export default function FacilityProfilePage() {
  const [isSaving,    setIsSaving]    = useState(false)
  const [facility,    setFacility]    = useState<any>(null)
  const [hoursError,  setHoursError]  = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FacilityForm>()

  useEffect(() => {
    facilityApi.getProfile().then(res => {
      const f = res.data.data
      setFacility(f)
      reset({
        name:        f.name,
        description: f.description ?? '',
        phone:       f.phone,
        email:       f.email ?? '',
        website:     f.website ?? '',
        address:     f.address ?? '',
        location:    f.location,
      })
    }).catch(() => toast.error('Failed to load facility profile.'))
  }, [reset])

  const onSave = async (data: FacilityForm) => {
    setIsSaving(true)
    try {
      await facilityApi.updateProfile(data)
      toast.success('Facility profile updated.')
    } catch {
      toast.error('Failed to update profile.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <FacilityLayout title="Facility Profile" subtitle="Manage your facility's public information.">
      <div className="max-w-2xl space-y-6">

        {/* Verification status */}
        {facility && (
          <div className="card p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 text-sm">{facility.name}</p>
              <p className="text-xs text-gray-500 capitalize">{facility.type}</p>
            </div>
            <Badge color={facility.is_verified ? 'green' : 'yellow'}>
              {facility.is_verified ? '✓ Verified' : 'Pending verification'}
            </Badge>
          </div>
        )}

        {/* Profile form */}
        <form onSubmit={handleSubmit(onSave)}>
          <div className="card p-5 space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <Building2 size={16} className="text-teal-600" /> Basic Information
            </h3>

            <Input label="Facility name" leftIcon={<Building2 size={15} />}
              error={errors.name?.message}
              {...register('name', { required: 'Facility name is required.' })} />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea rows={4} placeholder="Describe your facility's services and specialties…"
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                {...register('description')} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Phone" leftIcon={<Phone size={15} />} type="tel"
                {...register('phone')} />
              <Input label="Email" leftIcon={<Mail size={15} />} type="email"
                {...register('email')} />
              <Input label="Website" leftIcon={<Globe size={15} />}
                placeholder="https://"
                {...register('website')} />
              <Input label="Location / City" leftIcon={<MapPin size={15} />}
                {...register('location')} />
            </div>

            <Input label="Full address" leftIcon={<MapPin size={15} />}
              {...register('address')} />

            <div className="pt-2">
              <Button type="submit" isLoading={isSaving} leftIcon={<Save size={15} />}>
                Save changes
              </Button>
            </div>
          </div>
        </form>

        {/* Opening hours — read-only display */}
        {facility?.opening_hours && (
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2 mb-4">
              <Clock size={16} className="text-teal-600" /> Opening Hours
            </h3>
            <div className="space-y-2">
              {DAYS.map(day => {
                const h = facility.opening_hours[day]
                return (
                  <div key={day} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-sm font-medium text-gray-700 capitalize w-28">{day}</span>
                    {!h || h.closed
                      ? <Badge color="gray">Closed</Badge>
                      : <span className="text-sm text-gray-600">{h.open} – {h.close}</span>
                    }
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-gray-400 mt-3">Contact admin to update opening hours.</p>
          </div>
        )}
      </div>
    </FacilityLayout>
  )
}
