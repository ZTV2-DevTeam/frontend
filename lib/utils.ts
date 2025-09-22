import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get display name for admin type in Hungarian
 * Similar to the implementation in the admin dashboard
 */
export function getAdminTypeDisplayName(adminType?: string): string {
  switch (adminType) {
    case 'teacher':
      return 'Médiatanár'
    case 'developer':
    case 'dev':
      return 'Fejlesztő'
    case 'system_admin':
    case 'admin':
      return 'Rendszergazda'
    default:
      return 'Adminisztrátor'
  }
}

/**
 * Generate Google Calendar URL for a forgatas event
 * @param forgatas - The filming session data
 * @returns Google Calendar URL string
 */
export function generateGoogleCalendarUrl(forgatas: {
  name: string
  description?: string
  date: string
  time_from: string
  time_to: string
  location?: { name?: string; address?: string }
}): string {
  const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE'
  
  // Format dates and times for Google Calendar (YYYYMMDDTHHMMSSZ format)
  const formatGoogleCalendarDateTime = (date: string, time: string): string => {
    const dateObj = new Date(date)
    const [hours, minutes] = time.split(':').map(Number)
    
    // Set the time
    dateObj.setHours(hours, minutes, 0, 0)
    
    // Convert to ISO string and format for Google Calendar
    return dateObj.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  }
  
  const startDateTime = formatGoogleCalendarDateTime(forgatas.date, forgatas.time_from)
  const endDateTime = formatGoogleCalendarDateTime(forgatas.date, forgatas.time_to)
  const dates = `${startDateTime}/${endDateTime}`
  
  // Format location
  let location = ''
  if (forgatas.location?.name) {
    location = forgatas.location.name
    if (forgatas.location.address) {
      location += `, ${forgatas.location.address}`
    }
  }
  
  // Format description
  let details = forgatas.description || 'FTV Forgatás'
  if (forgatas.location?.name && !forgatas.description?.includes(forgatas.location.name)) {
    details += `\n\nHelyszín: ${forgatas.location.name}`
    if (forgatas.location.address) {
      details += `\nCím: ${forgatas.location.address}`
    }
  }
  details += '\n\nLétrehozva a FTV rendszerrel'
  
  // Build the URL
  const params = new URLSearchParams({
    text: forgatas.name,
    dates: dates,
    details: details,
    location: location,
    ctz: 'Europe/Budapest'
  })
  
  return `${baseUrl}&${params.toString()}`
}
