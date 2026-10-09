import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Phone, Star, CheckCircle, ArrowRight } from 'lucide-react'
import { PatientLayout } from '@/components/layout/PatientLayout'
import { Badge } from '@/components/common/Badge'
import { Spinner } from '@/components/common/Spinner'
import { EmptyState } from '@/components/common/EmptyState'
import { patientApi } from '@/api/patient'
import type { Facility } from '@/types'
import { clsx } from 'clsx'

const FACILITY_TYPES = [
  { value: '',            label: 'All types'   },
  { value: 'hospital',    label: 'Hospital'    },
  { value: 'clinic',      label: 'Clinic'      },
  { value: 'pharmacy',    label: 'Pharmacy'    },
  { value: 'laboratory',  label: 'Laboratory'  },
  { value: 'dental',      label: 'Dental'      },
  { value: 'mental_health', label: 'Mental Health' },
  { value: 'maternity',   label: 'Maternity'   },
]

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [isLoading,  setIsLoading]  = useState(true)
  const [search,     setSearch]     = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const load = async () => {
    setIsLoading(true)
    try {
      const res = await patientApi.getFacilities({ search, type: typeFilter || undefined, per_page: 20 })
      const payload = res.data.data as any
      setFacilities(Array.isArray(payload) ? payload : payload.data ?? [])
    } catch {
      setFacilities([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { load() }, [search, typeFilter])

  return (
    <PatientLayout title="Find a Facility" subtitle="Browse verified healthcare facilities near you.">
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        >
          {FACILITY_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : facilities.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<Search size={24} />}
            title="No facilities found"
            description="Try adjusting your search or filters."
          />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {facilities.map(f => (
            <FacilityCard key={f.id} facility={f} />
          ))}
        </div>
      )}
    </PatientLayout>
  )
}

function FacilityCard({ facility: f }: { facility: Facility }) {
  const typeLabels: Record<string, string> = {
    hospital: 'Hospital', clinic: 'Clinic', pharmacy: 'Pharmacy',
    laboratory: 'Laboratory', dental: 'Dental', eye_care: 'Eye Care',
    mental_health: 'Mental Health', maternity: 'Maternity', other: 'Other',
  }

  return (
    <div className="card p-5 hover:shadow-card-md transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
          🏥
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-gray-900 text-sm leading-tight">{f.name}</p>
            {f.is_verified && (
              <CheckCircle size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
            )}
          </div>
          <Badge color="teal" className="mt-1">{typeLabels[f.type] ?? f.type}</Badge>
        </div>
      </div>

      <div className="space-y-1.5 mb-4">
        <p className="flex items-center gap-2 text-xs text-gray-500">
          <MapPin size={12} /> {f.location}{f.address ? ` — ${f.address}` : ''}
        </p>
        {f.phone && (
          <p className="flex items-center gap-2 text-xs text-gray-500">
            <Phone size={12} /> {f.phone}
          </p>
        )}
        {f.rating && (
          <p className="flex items-center gap-1.5 text-xs text-gray-500">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            {f.rating.toFixed(1)} · {f.total_reviews} reviews
          </p>
        )}
      </div>

      {/* Services preview */}
      {f.services && f.services.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {f.services.slice(0, 3).map((s: any) => (
            <span key={s.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {s.name}
            </span>
          ))}
          {f.services.length > 3 && (
            <span className="text-xs text-gray-400">+{f.services.length - 3} more</span>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Link
          to={`/patient/book?facility=${f.id}`}
          className="flex-1 text-center py-2 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          Book appointment
        </Link>
        <Link
          to={`/facilities/${f.id}`}
          className="px-3 py-2 border border-gray-200 text-gray-600 text-xs rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
        >
          Details <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  )
}
