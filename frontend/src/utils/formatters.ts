import { format, formatDistanceToNow, parseISO } from 'date-fns'

/**
 * Format an ISO date string to a readable date.
 * e.g. "2024-03-15" → "March 15, 2024"
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), 'MMMM d, yyyy')
  } catch {
    return dateStr
  }
}

/**
 * Format an ISO date+time string.
 * e.g. "2024-03-15T09:00:00" → "March 15, 2024 at 9:00 AM"
 */
export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), "MMMM d, yyyy 'at' h:mm a")
  } catch {
    return dateStr
  }
}

/**
 * Relative time.
 * e.g. "3 hours ago", "in 2 days"
 */
export function timeAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true })
  } catch {
    return dateStr
  }
}

/**
 * Format time slot for display.
 * "09:00" → "9:00 AM"
 */
export function formatTime(timeStr: string | null | undefined): string {
  if (!timeStr) return '—'
  try {
    const [h, m] = timeStr.split(':').map(Number)
    const period = h >= 12 ? 'PM' : 'AM'
    const hour   = h % 12 || 12
    return `${hour}:${String(m).padStart(2, '0')} ${period}`
  } catch {
    return timeStr
  }
}

/**
 * Format currency.
 * 1500 → "KES 1,500"
 */
export function formatCurrency(amount: number | null | undefined, currency = 'RWF'): string {
  if (amount == null) return '—'
  return `${currency} ${amount.toLocaleString()}`
}

/**
 * Capitalise first letter of each word.
 */
export function titleCase(str: string): string {
  return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

/**
 * Extract the first error message from an API error response errors object.
 */
export function firstError(errors: Record<string, string[]> | undefined, field: string): string | undefined {
  return errors?.[field]?.[0]
}
