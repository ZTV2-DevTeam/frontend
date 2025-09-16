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
