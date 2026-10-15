import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Clock } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Spinner } from '@/components/common/Spinner'
import { EmptyState } from '@/components/common/EmptyState'
import { Badge } from '@/components/common/Badge'
import { useGroupedServices, useServiceCategories, type GroupedServices } from '@/hooks/useServices'
import { clsx } from 'clsx'

const categoryEmoji: Record<string, string> = {
  general:       '🩺',
  emergency:     '🚨',
  dental:        '🦷',
  laboratory:    '🔬',
  maternal:      '🤱',
  child_health:  '👶',
  vaccination:   '💉',
  mental_health: '🧠',
  pharmacy:      '💊',
  eye_care:      '👁️',
}

export default function ServicesPage() {
  const { groups, isLoading }  = useGroupedServices()
  const { categories }         = useServiceCategories()
  const [activeCategory, setActiveCategory] = useState('')
  const [search, setSearch]    = useState('')

  const filtered = groups.filter(g =>
    (!activeCategory || g.category === activeCategory) &&
    (!search || g.services.some(s =>
      (s as any).name.toLowerCase().includes(search.toLowerCase())
    ))
  )

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-r from-teal-700 to-primary-700 text-white py-14">
        <div className="page-container text-center">
          <h1 className="text-3xl font-bold mb-3">Healthcare Services</h1>
          <p className="text-white/80 max-w-xl mx-auto mb-6">
            Browse our full catalog of healthcare services available across verified facilities.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search services…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50" />
          </div>
        </div>
      </section>

      <div className="page-container py-10">
        {/* Category filter chips */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button onClick={() => setActiveCategory('')}
              className={clsx(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
                !activeCategory
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300',
              )}>
              All services
            </button>
            {categories.map(cat => (
              <button key={cat.value}
                onClick={() => setActiveCategory(activeCategory === cat.value ? '' : cat.value)}
                className={clsx(
                  'px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
                  activeCategory === cat.value
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300',
                )}>
                {categoryEmoji[cat.value] ?? '🏥'} {cat.label}
                <span className="ml-1.5 text-xs opacity-70">({cat.count})</span>
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Search size={24} />} title="No services found"
            description="Try a different search term or category." />
        ) : (
          <div className="space-y-10">
            {filtered.map(group => (
              <ServiceGroup key={group.category} group={group} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ServiceGroup({ group }: { group: GroupedServices }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{categoryEmoji[group.category] ?? '🏥'}</span>
        <h2 className="text-lg font-bold text-gray-900">{group.label}</h2>
        <div className="flex-1 h-px bg-gray-100" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {group.services.map(svc => (
          <ServiceCard key={(svc as any).id} service={svc as any} />
        ))}
      </div>
    </section>
  )
}

function ServiceCard({ service }: { service: Record<string, unknown> }) {
  const category    = service.category as string
  const description = typeof service.description === 'string' ? service.description : null
  const duration    = typeof service.duration_minutes === 'number' ? service.duration_minutes : 30
  const id          = service.id as number
  const name        = service.name as string

  return (
    <div className="card p-5 hover:shadow-card-md transition-shadow group">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-lg">
          {categoryEmoji[category] ?? '🩺'}
        </div>
        <Badge color="teal" className="text-xs capitalize">
          {category?.replace('_', ' ')}
        </Badge>
      </div>
      <h3 className="font-semibold text-gray-900 mb-1.5">{name}</h3>
      {description && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{description}</p>
      )}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock size={11} />
          {duration} min
        </div>
        <Link to={`/services/${id}`}
          className="text-xs text-primary-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Find facilities <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  )
}
