/**
 * Real API integration for absence management
 * This provides API functions and utilities for the absence management system
 */

import { apiClient } from '@/lib/api'

export interface Absence {
  id: number
  diak: {
    id: number
    username: string
    first_name: string
    last_name: string
    full_name: string
  }
  forgatas: {
    id: number
    name: string
    date: string
    time_from: string
    time_to: string
    type: string
  }
  date: string
  time_from: string
  time_to: string
  excused: boolean
  unexcused: boolean
  status: 'igazolt' | 'igazolatlan' | 'nincs_dontes'
  affected_classes: number[]
  osztaly?: {
    id: number
    name: string
    szekcio: string
    start_year: number
  }
}

export interface AbsenceUpdateData {
  excused?: boolean
  unexcused?: boolean
}

export interface AbsenceBulkUpdateData {
  absence_ids: (number | string)[]
  excused?: boolean
  unexcused?: boolean
}

export interface AbsenceStats {
  class_id: number
  total_students: number
  period: {
    start_date?: string
    end_date?: string
  }
  summary: {
    total_absences: number
    excused: number
    unexcused: number
    pending: number
  }
  students: Array<{
    student: {
      id: number
      username: string
      first_name: string
      last_name: string
      full_name: string
    }
    total_absences: number
    excused: number
    unexcused: number
    pending: number
  }>
}

// School schedule configuration
export const SCHOOL_SCHEDULE = {
  0: { name: "0. óra", start: "07:30", end: "08:15" },
  1: { name: "1. óra", start: "08:25", end: "09:10" },
  2: { name: "2. óra", start: "09:20", end: "10:05" },
  3: { name: "3. óra", start: "10:20", end: "11:05" },
  4: { name: "4. óra", start: "11:15", end: "12:00" },
  5: { name: "5. óra", start: "12:20", end: "13:05" },
  6: { name: "6. óra", start: "13:25", end: "14:10" },
  7: { name: "7. óra", start: "14:20", end: "15:05" },
  8: { name: "8. óra", start: "15:15", end: "16:00" },
} as const

// === API FUNCTIONS ===

/**
 * Get school absences for class teachers
 */
export async function getSchoolAbsences(params?: {
  class_id?: number
  student_id?: number
  start_date?: string
  end_date?: string
  status?: 'igazolt' | 'igazolatlan' | 'nincs_dontes'
}): Promise<Absence[]> {
  const rawData = await apiClient.getSchoolAbsences(params)
  
  // Ensure proper type conversion - IDs should be numbers
  return rawData.map((item: any): Absence => ({
    ...item,
    id: Number(item.id),
    diak: {
      ...item.diak,
      id: Number(item.diak.id)
    },
    forgatas: {
      ...item.forgatas,
      id: Number(item.forgatas.id)
    },
    osztaly: item.osztaly ? {
      ...item.osztaly,
      id: Number(item.osztaly.id)
    } : undefined
  }))
}

/**
 * Get detailed information about a specific school absence
 */
export async function getSchoolAbsenceDetails(absenceId: number): Promise<Absence> {
  const rawData = await apiClient.getSchoolAbsenceDetails(absenceId)
  
  // Ensure proper type conversion
  return {
    ...rawData,
    id: Number(rawData.id),
    diak: {
      ...rawData.diak,
      id: Number(rawData.diak.id)
    },
    forgatas: {
      ...rawData.forgatas,
      id: Number(rawData.forgatas.id)
    },
    osztaly: rawData.osztaly ? {
      ...rawData.osztaly,
      id: Number(rawData.osztaly.id)
    } : undefined
  }
}

/**
 * Update school absence status (excuse/unexcuse)
 */
export async function updateSchoolAbsence(absenceId: number | string, data: AbsenceUpdateData): Promise<Absence> {
  // Ensure absenceId is a number
  const numericId = typeof absenceId === 'string' ? parseInt(absenceId, 10) : absenceId
  
  if (isNaN(numericId)) {
    throw new Error(`Invalid absence ID: ${absenceId}`)
  }
  
  const rawData = await apiClient.updateSchoolAbsence(numericId, data)
  
  // Ensure proper type conversion in response
  return {
    ...rawData,
    id: Number(rawData.id),
    diak: {
      ...rawData.diak,
      id: Number(rawData.diak.id)
    },
    forgatas: {
      ...rawData.forgatas,
      id: Number(rawData.forgatas.id)
    },
    osztaly: rawData.osztaly ? {
      ...rawData.osztaly,
      id: Number(rawData.osztaly.id)
    } : undefined
  }
}

/**
 * Bulk update multiple school absences
 */
export async function bulkUpdateSchoolAbsences(data: AbsenceBulkUpdateData): Promise<{
  message: string
  updated_count: number
  total_requested: number
}> {
  // Ensure all absence_ids are numbers
  const cleanedData = {
    ...data,
    absence_ids: data.absence_ids.map(id => typeof id === 'string' ? parseInt(id, 10) : id).filter(id => !isNaN(id))
  }
  
  return apiClient.bulkUpdateSchoolAbsences(cleanedData)
}

/**
 * Get all absences for a specific class
 */
export async function getClassAbsences(
  classId: number, 
  params?: {
    start_date?: string
    end_date?: string
  }
): Promise<Absence[]> {
  return apiClient.getClassAbsences(classId, params)
}

/**
 * Get absence statistics for a class
 */
export async function getClassAbsenceStatistics(
  classId: number,
  params?: {
    start_date?: string
    end_date?: string
  }
): Promise<AbsenceStats> {
  return apiClient.getClassAbsenceStatistics(classId, params)
}

// === HELPER FUNCTIONS ===

export function getAbsenceStatusColor(absence: Absence): string {
  if (absence.excused && !absence.unexcused) {
    return "bg-green-500/20 text-green-400 border-green-500/30"
  } else if (absence.unexcused && !absence.excused) {
    return "bg-red-500/20 text-red-400 border-red-500/30"
  } else {
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  }
}

export function getAbsenceStatusText(absence: Absence): string {
  switch (absence.status) {
    case 'igazolt':
      return "Igazolt"
    case 'igazolatlan':
      return "Igazolatlan"
    case 'nincs_dontes':
    default:
      return "Elbírálás alatt"
  }
}

export function getAffectedClassesText(affectedClasses: number[]): string {
  return affectedClasses
    .map(classNum => SCHOOL_SCHEDULE[classNum as keyof typeof SCHOOL_SCHEDULE]?.name || `${classNum}. óra`)
    .join(', ')
}
