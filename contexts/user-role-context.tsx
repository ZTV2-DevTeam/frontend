"use client"

import React, { createContext, useContext, useState } from 'react'
import { useRouter } from 'next/navigation'

export type UserRole = 'admin' | 'class-teacher' | 'student'

export interface Team {
  name: string
  logo: React.ElementType
  plan: string
  role: UserRole
}

interface UserRoleContextType {
  currentRole: UserRole
  setRole: (role: UserRole) => void
  teams: Team[]
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined)

export function useUserRole() {
  const context = useContext(UserRoleContext)
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider')
  }
  return context
}

export function UserRoleProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('student')
  const router = useRouter()

  const teams: Team[] = [
    {
      name: "Adminisztrátor",
      role: 'admin',
      logo: () => null, // Will be set from the component
      plan: "Adminisztráció, beosztások",
    },
    {
      name: "Osztályfőnök", 
      role: 'class-teacher',
      logo: () => null,
      plan: "Igazoláskezelés",
    },
    {
      name: "Diák",
      role: 'student', 
      logo: () => null,
      plan: "Diákoknak",
    },
  ]

  const setRole = (role: UserRole) => {
    setCurrentRole(role)
    // Navigate to dashboard when role changes
    router.push('/app/iranyitopult')
  }

  return (
    <UserRoleContext.Provider value={{ currentRole, setRole, teams }}>
      {children}
    </UserRoleContext.Provider>
  )
}
