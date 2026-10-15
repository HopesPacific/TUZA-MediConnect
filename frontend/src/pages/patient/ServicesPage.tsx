import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Clock } from 'lucide-react'
import { PatientLayout } from '@/components/layout/PatientLayout'
import { Spinner } from '@/components/common/Spinner'
import { EmptyState } from '@/components/common/EmptyState'
import { Badge } from '@/components/common/Badge'
import { useGroupedServices, useServiceCategories, type GroupedServices } from '@/hooks/useServices'
import { clsx } from 'clsx'

const categoryEmoji: Record<string, string> = {
  general: '🩺', emergency: '🚨', dental: '🦷', laboratory: '🔬',
  maternal: '🤱', child_health: '👶', vaccination: '💉',
  mental_health: '🧠', pharmacy: '💊', eye_care: '👁️',
}

export default function PatientServicesPage() {
  const { groups, isLoading } = useGroupedServices()
  const { categories }        = useServiceCategories()
  const [activeCategory, setActiveCategory] = useState('')
  const [search, setSearch] = useState('')

  const filtered = groups.filter(g =>
    (!activeCategory || g.category === activeCategory) &&
    (!search || g.services.some(s => (s as any).name.toLowerCase().includes(search.toLowerCase())))
  )

  return (
    <PatientLayout title="Healthcare Services" subtitle="Browse all services available across our facilities.">
      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search services…" value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setActiveCategory('')}
          className={clsx('px-3 py-1 rounded-full text-xs font-medium border transition-colors',
            !activeCategory ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300')}>
          All
        </button>
        {categories.map(cat => (
          <button key={cat.value} onClick={() => setActiveCategory(activeCategory === cat.value ? '' : cat.value)}
            className={clsx('px-3 py-1 rounded-full text-xs font-medium border transition-colors',
              activeCategory === cat.value ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300')}>
            {categoryEmoji[cat.value] ?? '🏥'} {cat.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Search size={24} />} title="No services found" description="Try a different search or category." />
      ) : (
        <div className="space-y-8">
          {filtered.map(group => (
            <section key={group.category}>
              <div className="flex items-center gap-2 mb-3">
                <span>{categoryEmoji[group.category] ?? '🏥'}</span>
                <h2 className="font-semibold text-gray-900 text-sm">{group.label}</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {group.services.map(svc => {
                  const s = svc as any
                  return (
                    <div key={s.id} className="card p-4 hover:shadow-card-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 text-sm">{s.name}</h3>
                        <Badge color="teal" className="text-xs">{s.category?.replace('_', ' ')}</Badge>
                      </div>
                      {s.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{s.description}</p>}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={10} /> {s.duration_minutes ?? 30} min</span>
                        <Link to={`/patient/book?service=${s.id}`}
                          className="text-xs text-primary-600 font-medium flex items-center gap-1 hover:underline">
                          Book <ArrowRight size={11} />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </PatientLayout>
  )
}
