import { FacilitySidebar } from './FacilitySidebar'

interface FacilityLayoutProps {
  children:  React.ReactNode
  title?:    string
  subtitle?: string
}

export function FacilityLayout({ children, title, subtitle }: FacilityLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <FacilitySidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 lg:p-8 max-w-6xl w-full mx-auto">
          {(title || subtitle) && (
            <div className="mb-6">
              {title    && <h1 className="text-xl font-bold text-gray-900">{title}</h1>}
              {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}
