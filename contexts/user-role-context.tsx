"use client"

import React, { createContext, useContext, useState } from 'react'
import { useRouter } from 'next/navigation'

export type UserRole = 'admin' | 'class-teacher' | 'student'

export interface Team {
  name: string
  logo: React.ElementType
  plan: string
  role: UserRole
  isPreview?: boolean
}

interface UserRoleContextType {
  currentRole: UserRole
  setRole: (role: UserRole) => void
  teams: Team[]
  isPreviewMode: boolean
  actualUserRole: UserRole | null
  initializeUserRole: (userRole: UserRole) => void
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
  const [actualUserRole, setActualUserRole] = useState<UserRole | null>(null)
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

  const isPreviewMode = actualUserRole !== null && 
                        actualUserRole !== currentRole && 
                        actualUserRole === 'admin' // Only admins can have preview mode

  // Function to set the actual user role based on permissions
  const initializeUserRole = (userRole: UserRole) => {
    if (actualUserRole === null) {
      console.log(`🎭 Setting actual user role to: ${userRole}`)
      setActualUserRole(userRole)
      setCurrentRole(userRole)
    } else {
      console.log(`🎭 Actual user role already set to: ${actualUserRole}, skipping initialization`)
    }
  }

  const setRole = (role: UserRole) => {
    // Prevent unnecessary navigation if role hasn't actually changed
    if (role === currentRole) {
      console.log(`🔄 Role unchanged (${role}), skipping navigation`)
      return
    }
    
    console.log(`🎭 Role changed: ${currentRole} -> ${role}`)
    
    // If this is the first role switch and we haven't set actualUserRole yet
    // (this shouldn't normally happen as it should be set via initializeUserRole)
    if (actualUserRole === null) {
      setActualUserRole(currentRole)
    }
    
    setCurrentRole(role)
    
    // Always redirect to dashboard when role changes
    console.log(`🏠 Redirecting to dashboard for role: ${role}`)
    router.push('/app/iranyitopult')
  }

  return (
    <UserRoleContext.Provider value={{ 
      currentRole, 
      setRole, 
      teams, 
      isPreviewMode, 
      actualUserRole,
      initializeUserRole
    }}>
      {children}
    </UserRoleContext.Provider>
  )
}
