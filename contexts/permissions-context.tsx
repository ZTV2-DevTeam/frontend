'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiClient, UserPermissionsSchema } from '@/lib/api'
import { DEBUG_CONFIG } from '@/lib/config'
import { useAuth } from '@/contexts/auth-context'

export interface UserPermissions {
  user_info: Record<string, any>
  permissions: Record<string, any>
  display_properties: Record<string, any>
  role_info: Record<string, any>
}

export type AvailableRole = 'admin' | 'class-teacher' | 'student'

interface PermissionsContextType {
  permissions: UserPermissions | null
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  hasPermission: (permission: string) => boolean
  canAccessPage: (page: string) => boolean
  getAvailableRoles: () => AvailableRole[]
  getCurrentRole: () => AvailableRole
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined)

export function usePermissions() {
  const context = useContext(PermissionsContext)
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider')
  }
  return context
}

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const fetchPermissions = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      if (!apiClient.isAuthenticated()) {
        if (DEBUG_CONFIG.LOG_API_CALLS) {
          console.log('🔐 Not authenticated, skipping permissions fetch')
        }
        setPermissions(null)
        return
      }

      // Add timeout and retry for permissions fetch
      console.log('🔄 Fetching permissions for authenticated user...')
      const data = await Promise.race([
        apiClient.getPermissions(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Permissions fetch timeout')), 15000) // Reduced to 15s
        )
      ])
      
      setPermissions(data)
      
      if (DEBUG_CONFIG.LOG_API_CALLS) {
        console.log('✅ Permissions loaded:', {
          primaryRole: data.role_info?.primary_role,
          roles: data.role_info?.roles,
          adminType: data.role_info?.admin_type,
          isAdmin: data.permissions?.is_admin
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load permissions'
      setError(errorMessage)
      
      // If it's a timeout or connection error, don't clear permissions immediately
      if (errorMessage.includes('timeout') || 
          errorMessage.includes('Hálózati hiba') ||
          errorMessage.includes('időtúllépés')) {
        console.warn('⚠️ Permissions fetch timeout - keeping existing permissions if available')
        // Don't clear existing permissions on timeout to prevent user logout
        if (!permissions) {
          // Only provide fallback if no permissions exist at all
          provideFallbackPermissions()
        }
        return
      }
      
      // If it's a CORS or network error, provide fallback permissions for development
      if (errorMessage.includes('CORS') || errorMessage.includes('NetworkError') || errorMessage.includes('Failed to fetch')) {
        console.warn('🚧 CORS/Network error detected, providing fallback permissions for development')
        provideFallbackPermissions()
        return
      }
      
      // For other errors, clear permissions
      setPermissions(null)
      
      if (DEBUG_CONFIG.ENABLED) {
        console.error('❌ Failed to fetch permissions:', err)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const provideFallbackPermissions = () => {
    // Create minimal fallback permissions for development
    const fallbackPermissions: UserPermissions = {
      user_info: {
        id: 1,
        username: 'dev-user',
        first_name: 'Development',
        last_name: 'User',
        email: 'dev@example.com',
        full_name: 'Development User',
        is_staff: true,
        is_superuser: true,
        is_active: true,
        date_joined: new Date().toISOString(),
        has_profile: true
      },
      permissions: {
        is_admin: true,
        is_developer_admin: true,
        is_teacher_admin: false,
        is_system_admin: false,
        is_superuser: true,
        is_staff: true,
        can_manage_users: true,
        can_manage_partners: true,
        can_manage_equipment: true,
        can_manage_forgatas: true,
        can_manage_announcements: true,
        can_access_admin_panel: true,
        can_view_all_users: true,
        can_view_all_forgatas: true,
        can_create_forgatas: true
      },
      display_properties: {
        show_admin_menu: true,
        show_teacher_menu: false,
        show_student_menu: true,
        navigation_items: ['dashboard', 'forgatas', 'users', 'partners', 'equipment', 'announcements', 'profile']
      },
      role_info: {
        primary_role: 'developer_admin',
        admin_type: 'dev',
        roles: ['Developer Admin']
      }
    }
    
    setPermissions(fallbackPermissions)
    console.log('🔧 Using fallback permissions for development')
  }

  useEffect(() => {
    console.log('🔍 Permissions useEffect triggered:', { 
      authLoading, 
      isAuthenticated, 
      hasUser: !!user,
      username: user?.username 
    })
    
    // Only fetch permissions when auth is ready and user is authenticated
    if (!authLoading) {
      if (isAuthenticated && user) {
        console.log('🔄 Auth state changed - fetching permissions for user:', user.username)
        fetchPermissions()
      } else {
        console.log('🔄 User logged out - clearing permissions')
        setPermissions(null)
        setIsLoading(false)
        setError(null)
      }
    }
  }, [authLoading, isAuthenticated, user])

  const hasPermission = (permission: string): boolean => {
    return permissions?.permissions[permission] || false
  }

  const canAccessPage = (page: string): boolean => {
    if (!permissions) return false

    const { permissions: perms, display_properties, role_info } = permissions

    // If permissions are not properly loaded, default to basic access
    if (!perms) {
      // Allow basic pages
      return ['/', '/app/iranyitopult', '/app/segitseg'].includes(page)
    }

    // Check user role types
    const isSystemAdmin = perms?.is_system_admin || role_info?.primary_role === 'system_admin' || role_info?.admin_type === 'system_admin'
    const isTeacherAdmin = perms?.is_teacher_admin || role_info?.admin_type === 'teacher'
    const isGeneralAdmin = perms?.is_admin
    const isClassTeacher = perms?.is_osztaly_fonok || role_info?.special_role === 'class_teacher' || perms?.can_manage_class_students
    
    // System admins, teacher admins (médiatanárok), and general admins can access everything
    if (isSystemAdmin || isTeacherAdmin || isGeneralAdmin) {
      return true
    }

    // Define page access rules based on role hierarchy
    switch (page) {
      // Dashboard - everyone can access
      case '/app/iranyitopult':
        return true

      // Staff page - accessible by everyone except class teachers (osztályfőnökök)
      case '/app/stab':
        return true // Everyone can access staff contact info
      
      case '/app/database-admin':
        return perms.is_developer_admin || perms.is_system_admin

      case '/app/beallitasok':
        return perms.can_access_admin_panel || perms.is_admin || isSystemAdmin || isTeacherAdmin || isGeneralAdmin

      // Teacher/Admin pages
      case '/app/forgatasok':
        return perms.can_view_all_forgatas || perms.can_create_forgatas || display_properties?.show_teacher_menu || display_properties?.show_student_menu

      case '/app/beosztas':
        return perms.can_manage_forgatas || perms.is_teacher_admin || perms.is_developer_admin

      // Class management
      case '/app/igazolasok':
        return perms.is_osztaly_fonok || display_properties?.show_class_management || display_properties?.show_student_menu

      // Radio pages
      case '/app/radio':
        return perms.can_participate_in_radio || perms.can_view_radio_schedule || display_properties?.show_radio_menu

      // Equipment and partners
      case '/app/felszereles':
        return perms.can_manage_equipment || display_properties?.show_equipment_management || display_properties?.show_student_menu

      case '/app/partnerek':
        return perms.can_manage_partners || display_properties?.show_partner_management || display_properties?.show_student_menu

      // Announcements
      case '/app/uzenofal':
        return perms.can_manage_announcements || display_properties?.navigation_items?.includes('announcements') || display_properties?.show_student_menu

      // Calendar
      case '/app/naptar':
        return display_properties?.navigation_items?.includes('calendar') || display_properties?.show_student_menu || display_properties?.show_teacher_menu

      // Absence management
      case '/app/tavollet':
        return display_properties?.show_student_menu || display_properties?.show_teacher_menu || display_properties?.show_class_management

      // KaCsa (filming requests)
      case '/app/kacsa':
        return display_properties?.show_student_menu || display_properties?.show_teacher_menu

      // Help - everyone can access
      case '/app/segitseg':
        return true

      default:
        // Allow access to pages not explicitly restricted
        return true
    }
  }

  const getAvailableRoles = (): AvailableRole[] => {
    if (!permissions) return ['student'] // Default fallback

    const { permissions: perms, role_info, display_properties } = permissions
    const roles: AvailableRole[] = []

    // Check if user is a system admin or teacher admin (médiatanár) or general admin
    const isSystemAdmin = perms?.is_system_admin || role_info?.primary_role === 'system_admin' || role_info?.admin_type === 'system_admin'
    const isTeacherAdmin = perms?.is_teacher_admin || role_info?.admin_type === 'teacher'
    const isGeneralAdmin = perms?.is_admin
    
    console.log('🔍 Role Analysis:', {
      isSystemAdmin,
      isTeacherAdmin,
      isGeneralAdmin,
      primary_role: role_info?.primary_role,
      admin_type: role_info?.admin_type,
      is_system_admin: perms?.is_system_admin,
      is_teacher_admin: perms?.is_teacher_admin,
      is_admin: perms?.is_admin,
      is_osztaly_fonok: perms?.is_osztaly_fonok,
      special_role: role_info?.special_role
    })
    
    // Admin role: Rendszeradmin OR Tanár-admin (Médiatanár) OR általános admin szerepkör
    if (isSystemAdmin || isTeacherAdmin || isGeneralAdmin) {
      roles.push('admin')
    }
    
    // Class teacher role: Osztályfőnök (can be combined with admin if they are also médiatanár)
    const isClassTeacher = perms?.is_osztaly_fonok || role_info?.special_role === 'class_teacher' || perms?.can_manage_class_students
    if (isClassTeacher) {
      roles.push('class-teacher')
    }

    // Student role: Only add if user has no admin or teacher roles, OR explicitly shown in display properties
    const hasAdminRole = roles.includes('admin')
    const hasClassTeacherRole = roles.includes('class-teacher')
    
    // Add student role if:
    // 1. User has no other roles (pure student)
    // 2. Display properties explicitly show student menu (fallback access)
    if (!hasAdminRole && !hasClassTeacherRole) {
      roles.push('student')
    } else if (display_properties?.show_student_menu && roles.length === 0) {
      roles.push('student')
    }

    // If somehow no roles are determined, fallback to student
    if (roles.length === 0) {
      roles.push('student')
    }

    console.log('✅ Available roles determined:', roles)

    // Remove duplicates and return
    return [...new Set(roles)]
  }

  const getCurrentRole = (): AvailableRole => {
    if (!permissions) return 'student'

    const availableRoles = getAvailableRoles()
    const { role_info, permissions: perms } = permissions
    
    // If no roles available, fallback to student
    if (availableRoles.length === 0) return 'student'
    
    // If only one role available, use that
    if (availableRoles.length === 1) return availableRoles[0]

    // Multiple roles available - prioritize based on hierarchy and role types
    const isSystemAdmin = perms?.is_system_admin || role_info?.primary_role === 'system_admin' || role_info?.admin_type === 'system_admin'
    const isTeacherAdmin = perms?.is_teacher_admin || role_info?.admin_type === 'teacher' || perms?.is_admin
    const isGeneralAdmin = perms?.is_admin
    const isClassTeacher = perms?.is_osztaly_fonok || role_info?.special_role === 'class_teacher'
    
    // Priority 1: System Admin always gets admin role
    if (availableRoles.includes('admin') && isSystemAdmin) {
      return 'admin'
    }
    
    // Priority 2: Médiatanár (teacher admin) gets admin role
    if (availableRoles.includes('admin') && isTeacherAdmin) {
      return 'admin'
    }
    
    // Priority 3: General admin gets admin role
    if (availableRoles.includes('admin') && isGeneralAdmin) {
      return 'admin'
    }
    
    // Priority 4: Pure osztályfőnök (class teacher without admin rights) gets class-teacher role  
    if (availableRoles.includes('class-teacher') && isClassTeacher && !isTeacherAdmin && !isSystemAdmin && !isGeneralAdmin) {
      return 'class-teacher'
    }
    
    // Priority 4: If user has both admin and class-teacher roles (médiatanár + osztályfőnök), default to admin
    if (availableRoles.includes('admin')) {
      return 'admin'
    }
    
    // Priority 5: Fallback to class-teacher if available
    if (availableRoles.includes('class-teacher')) {
      return 'class-teacher'
    }
    
    // Priority 6: Fallback to student
    if (availableRoles.includes('student')) {
      return 'student'
    }

    // Final fallback to first available role
    return availableRoles[0]
  }

  const refresh = async () => {
    await fetchPermissions()
  }

  const value: PermissionsContextType = {
    permissions,
    isLoading,
    error,
    refresh,
    hasPermission,
    canAccessPage,
    getAvailableRoles,
    getCurrentRole,
  }

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  )
}
