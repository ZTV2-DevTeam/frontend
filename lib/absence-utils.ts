import { parseISO, isValid, format } from 'date-fns'
import { hu } from 'date-fns/locale'

export function validateDateRange(startDate: string, endDate: string): { valid: boolean; error?: string } {
  if (!startDate || !endDate) {
    return { valid: false, error: 'Mindkét dátum megadása kötelező' }
  }

  const start = parseISO(startDate)
  const end = parseISO(endDate)

  if (!isValid(start) || !isValid(end)) {
    return { valid: false, error: 'Hibás dátum formátum' }
  }

  if (start > end) {
    return { valid: false, error: 'A záró dátumnak a kezdő dátum után kell lennie' }
  }

  return { valid: true }
}

export function formatDateForDisplay(dateString: string): string {
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return dateString
    return format(date, 'yyyy. MM. dd.', { locale: hu })
  } catch {
    return dateString
  }
}

export function getTodayISOString(): string {
  return new Date().toISOString().split('T')[0]
}

export function getStatusColor(status: string, denied: boolean): string {
  if (denied) return 'text-red-600'
  
  switch (status) {
    case 'jövőbeli': return 'text-blue-600'
    case 'folyamatban': return 'text-orange-600'
    case 'lezárt': return 'text-green-600'
    default: return 'text-gray-600'
  }
}

export function getStatusLabel(status: string, denied: boolean): string {
  if (denied) return 'Elutasítva'
  
  switch (status) {
    case 'jövőbeli': return 'Jövőbeli'
    case 'folyamatban': return 'Folyamatban'
    case 'lezárt': return 'Lezárt'
    default: return status
  }
}
