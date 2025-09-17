/**
 * Form configuration data for creating new filming sessions
 */

export interface Reporter {
  id: string
  name: string
  class: string
  email: string
}

export interface Location {
  id: string
  name: string
  address: string
  type: 'internal' | 'external'
}

export interface Contact {
  id: string
  name: string
  organization: string
  phone: string
  email?: string
}

export interface KacsaShooting {
  id: string
  title: string
  date: string
  week: 'first' | 'second'
}

export interface ShootingType {
  value: string
  label: string
  description: string
}

// Mock data - these would normally come from API endpoints
export const reporters: Reporter[] = [
  {
    id: '1',
    name: 'Nagy Péter',
    class: '10F',
    email: 'nagy.peter@szlgbp.hu'
  },
  {
    id: '2', 
    name: 'Kiss Anna',
    class: '11F',
    email: 'kiss.anna@szlgbp.hu'
  },
  {
    id: '3',
    name: 'Kovács János', 
    class: '12F',
    email: 'kovacs.janos@szlgbp.hu'
  }
]

export const locations: Location[] = [
  {
    id: '1',
    name: 'SZLG Főépület',
    address: 'Budapest, Szinyei Merse Pál u. 19.',
    type: 'internal'
  },
  {
    id: '2',
    name: 'SZLG Tornaterem',
    address: 'Budapest, Szinyei Merse Pál u. 19.',
    type: 'internal'
  },
  {
    id: '3',
    name: 'Városháza',
    address: 'Budapest, Váci út 62-64.',
    type: 'external'
  },
  {
    id: '4',
    name: 'Művelődési Központ',
    address: 'Budapest, Fő tér 1.',
    type: 'external'
  }
]

export const contacts: Contact[] = [
  {
    id: '1',
    name: 'Dr. Szabó Mária',
    organization: 'SZLG',
    phone: '+36 1 234 5678',
    email: 'szabo.maria@szlgbp.hu'
  },
  {
    id: '2',
    name: 'Tóth László',
    organization: 'Városháza',
    phone: '+36 1 234 5679',
    email: 'toth.laszlo@budapest.hu'
  },
  {
    id: '3',
    name: 'Varga Eszter',
    organization: 'Művelődési Központ',
    phone: '+36 1 234 5680',
    email: 'varga.eszter@kulturnk.hu'
  }
]

export const kacsaShootings: KacsaShooting[] = [
  {
    id: '1',
    title: 'Őszi KaCsa 2024',
    date: '2024-10-15',
    week: 'first'
  },
  {
    id: '2',
    title: 'Tavaszi KaCsa 2025',
    date: '2025-04-20',
    week: 'second'
  }
]

export const shootingTypes: ShootingType[] = [
  {
    value: 'rendes',
    label: 'KaCsa forgatás',
    description: 'Hagyományos forgatási projekt'
  },
  {
    value: 'kacsa',
    label: 'KaCsa összejátszás',
    description: 'Különleges KaCsa projekt'
  },
  {
    value: 'rendezveny',
    label: 'Rendezvény forgatás',
    description: 'Esemény dokumentálása'
  },
  {
    value: 'egyeb',
    label: 'Egyéb forgatás',
    description: 'Speciális projekt típus'
  }
]

/**
 * Get current school year in format "2024/2025"
 */
export function getCurrentSchoolYear(): string {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1 // 0-indexed months
  
  // School year starts in September (month 9)
  if (currentMonth >= 9) {
    return `${currentYear}/${currentYear + 1}`
  } else {
    return `${currentYear - 1}/${currentYear}`
  }
}

/**
 * Get school year from a given date
 */
export function getSchoolYearFromDate(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  
  if (month >= 9) {
    return `${year}/${year + 1}`
  } else {
    return `${year - 1}/${year}`
  }
}
