'use client'

import { useEffect, useRef } from 'react'
import { usePermissions } from '@/contexts/permissions-context'
import { useUserRole } from '@/contexts/user-role-context'

export function RoleSynchronizer() {
  const { permissions, getCurrentRole, isLoading, error } = usePermissions()
  const { setRole, currentRole, initializeUserRole, actualUserRole } = useUserRole()
  const lastSyncedRole = useRef<string | null>(null)
  const syncInProgress = useRef(false)
  const hasInitialized = useRef(false)

  useEffect(() => {
    // Only sync role when permissions are loaded and we have valid permissions
    if (!isLoading && permissions && !syncInProgress.current) {
      try {
        const primaryRole = getCurrentRole()
        
        // Initialize the actual user role on first load
        if (!hasInitialized.current && actualUserRole === null) {
          console.log(`🎭 Initializing actual user role: ${primaryRole}`)
          initializeUserRole(primaryRole)
          hasInitialized.current = true
          
          // Don't sync current role on first initialization if it matches primary role
          if (currentRole === primaryRole) {
            console.log(`🎭 Current role already matches primary role: ${primaryRole}`)
            return
          }
        }
        
        // Only update role if it's different from current AND it's different from last synced
        // This prevents infinite loops and unnecessary role changes
        if (primaryRole !== currentRole && primaryRole !== lastSyncedRole.current) {
          console.log(`🔄 Syncing role from '${currentRole}' to '${primaryRole}'`)
          
          syncInProgress.current = true
          setRole(primaryRole)
          lastSyncedRole.current = primaryRole
          
          // Reset sync flag after a short delay to allow state updates
          setTimeout(() => {
            syncInProgress.current = false
          }, 500)
        }
      } catch (err) {
        console.warn('⚠️ Failed to sync role:', err)
        // If role sync fails, ensure we at least have a basic role set
        // Don't change the current role if sync fails to prevent disruption
      }
    }
    
    // If there's an error loading permissions but we're authenticated, 
    // keep the current role and don't force logout
    if (error && !isLoading) {
      console.warn('⚠️ Permissions error, preserving current role to prevent logout:', currentRole)
      // Don't sync roles when there's an error to prevent unwanted logouts
    }
  }, [isLoading, permissions, error, getCurrentRole, currentRole, setRole, initializeUserRole, actualUserRole])

  // This component doesn't render anything
  return null
}
