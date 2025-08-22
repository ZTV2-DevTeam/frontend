'use client'

import { useEffect } from 'react'
import { useUserRole } from '@/contexts/user-role-context'
import { usePermissions } from '@/contexts/permissions-context'

/**
 * Hook to initialize user role based on permissions
 * This should be called once when the app starts and permissions are loaded
 */
export function useRoleInitialization() {
  const { initializeUserRole, actualUserRole } = useUserRole()
  const { permissions, isLoading, getCurrentRole } = usePermissions()

  useEffect(() => {
    // Only initialize if we haven't set the actual user role yet and permissions are loaded
    if (!isLoading && permissions && actualUserRole === null) {
      const userRole = getCurrentRole()
      console.log('🎭 Initializing user role:', userRole)
      initializeUserRole(userRole)
    }
  }, [permissions, isLoading, actualUserRole, getCurrentRole, initializeUserRole])
}
