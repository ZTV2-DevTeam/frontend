'use client'

import { useEffect } from 'react'
import { usePermissions } from '@/contexts/permissions-context'
import { useUserRole } from '@/contexts/user-role-context'

export function RoleSynchronizer() {
  const { permissions, getCurrentRole, isLoading, error } = usePermissions()
  const { setRole, currentRole } = useUserRole()

  useEffect(() => {
    // Only sync role when permissions are loaded and we have valid permissions
    if (!isLoading && permissions) {
      try {
        const primaryRole = getCurrentRole()
        
        // Only update role if it's different from current and not the default
        if (primaryRole !== currentRole) {
          console.log(`🔄 Syncing role from '${currentRole}' to '${primaryRole}'`)
          setRole(primaryRole)
        }
      } catch (err) {
        console.warn('⚠️ Failed to sync role:', err)
        // If role sync fails, ensure we at least have a basic role set
        if (currentRole === 'student') {
          // Don't change anything, student is a safe default
        }
      }
    }
    
    // If there's an error loading permissions but we're authenticated, 
    // keep the current role (likely student which is the default)
    if (error && !isLoading) {
      console.warn('⚠️ Permissions error, keeping current role:', currentRole)
    }
  }, [isLoading, permissions, error, getCurrentRole, currentRole, setRole])

  // This component doesn't render anything
  return null
}
