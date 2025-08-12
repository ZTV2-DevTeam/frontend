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
    // Prevent unnecessary navigation if role hasn't actually changed
    if (role === currentRole) {
      console.log(`🔄 Role unchanged (${role}), skipping navigation`)
      return
    }
    
    console.log(`🎭 Role changed: ${currentRole} -> ${role}`)
    setCurrentRole(role)
    
    // Don't auto-navigate on role change - let the user choose where to go
    // Only navigate to dashboard if we're on a page that doesn't exist for the new role
    // This prevents unwanted navigation interruptions
  }

  return (
    <UserRoleContext.Provider value={{ currentRole, setRole, teams }}>
      {children}
    </UserRoleContext.Provider>
  )
}
