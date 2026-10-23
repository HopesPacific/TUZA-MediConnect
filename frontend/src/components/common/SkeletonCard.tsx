import { clsx } from 'clsx'
import type { CSSProperties } from 'react'

interface SkeletonProps {
  className?: string
  style?:     CSSProperties
}

export function Skeleton({ className, style }: SkeletonProps) {
  return <div className={clsx('animate-pulse bg-gray-200 rounded', className)} style={style} />
}

export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 flex gap-4">
        {[40, 25, 20, 15].map((w, i) => (
          <Skeleton key={i} className="h-3 rounded" style={{ width: `${w}%` }} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-4 py-3.5 flex gap-4 border-t border-gray-50">
          <div className="flex items-center gap-2.5" style={{ width: '40%' }}>
            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-2.5 w-1/2" />
            </div>
          </div>
          {[25, 20, 15].map((w, j) => (
            <Skeleton key={j} className="h-3.5 rounded my-auto" style={{ width: `${w}%` }} />
          ))}
        </div>
      ))}
    </div>
  )
}
