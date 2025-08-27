import { parseISO, isValid, format } from 'date-fns'
import { hu } from 'date-fns/locale'

export function validateDateRange(startDate: string, endDate: string): { valid: boolean; error?: string } {
  if (!startDate || !endDate) {
    return { valid: false, error: 'Mindkét dátum és idő megadása kötelező' }
  }

  const start = parseISO(startDate)
  const end = parseISO(endDate)

  if (!isValid(start) || !isValid(end)) {
    return { valid: false, error: 'Hibás dátum/idő formátum. Használj ISO formátumot' }
  }

  if (start >= end) {
    return { valid: false, error: 'A záró időpontnak a kezdő időpont után kell lennie' }
  }

  return { valid: true }
}

export function formatDateForDisplay(dateString: string): string {
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return dateString
    
    // Check if this is a datetime string or just a date
    if (dateString.includes('T') || dateString.includes(' ')) {
      return format(date, 'yyyy. MM. dd. HH:mm', { locale: hu })
    } else {
      return format(date, 'yyyy. MM. dd.', { locale: hu })
    }
  } catch {
    return dateString
  }
}

export function formatDateTimeForDisplay(dateString: string): string {
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return dateString
    return format(date, 'yyyy. MM. dd. HH:mm', { locale: hu })
  } catch {
    return dateString
  }
}

export function formatDateTimeForDisplayCompact(dateString: string): string {
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return dateString
    return format(date, 'MM. dd.\nHH:mm', { locale: hu })
  } catch {
    return dateString
  }
}

export function formatDateTimeForDisplaySplit(dateString: string): { date: string; time: string } {
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) {
      return { date: dateString, time: '' }
    }
    return {
      date: format(date, 'yyyy. MM. dd.', { locale: hu }),
      time: format(date, 'HH:mm', { locale: hu })
    }
  } catch {
    return { date: dateString, time: '' }
  }
}

export function getTodayISOString(): string {
  return new Date().toISOString().split('T')[0]
}

export function getTodayDateTimeISOString(): string {
  const now = new Date()
  // Set to 9:00 AM for default start time
  now.setHours(9, 0, 0, 0)
  return now.toISOString()
}

export function getEndOfDayISOString(): string {
  const now = new Date()
  // Set to 5:00 PM for default end time
  now.setHours(17, 0, 0, 0)
  return now.toISOString()
}

export function convertDateToDateTime(dateString: string, isEndDate: boolean = false): string {
  try {
    // If already a datetime string, return as-is
    if (dateString.includes('T')) {
      return dateString
    }

    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return dateString
    }

    // For start dates, set to 00:00:00 (beginning of day)
    // For end dates, set to 23:59:59 (end of day)
    if (isEndDate) {
      date.setHours(23, 59, 59, 999)
    } else {
      date.setHours(0, 0, 0, 0)
    }

    return date.toISOString()
  } catch {
    return dateString
  }
}

export function formatDateTimeForApi(date: Date): string {
  return date.toISOString()
}

export function parseDateTimeFromInput(dateTimeLocal: string): Date {
  // Handle datetime-local input format (YYYY-MM-DDTHH:MM)
  return new Date(dateTimeLocal)
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
