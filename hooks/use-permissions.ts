'use client'

import { usePermissions } from '@/contexts/permissions-context'

/**
 * Hook for checking user permissions in components
 */
export function useAuth() {
  const { permissions, hasPermission, canAccessPage, isLoading, error } = usePermissions()
  
  return {
    // User information
    user: permissions?.user_info || null,
    roles: permissions?.role_info?.roles || [],
    primaryRole: permissions?.role_info?.primary_role || 'student',
    
    // Permission checks
    hasPermission,
    canAccessPage,
    
    // Specific permission shortcuts
    isAdmin: permissions?.permissions?.is_admin || false,
    isDeveloperAdmin: permissions?.permissions?.is_developer_admin || false,
    isTeacherAdmin: permissions?.permissions?.is_teacher_admin || false,
    isSystemAdmin: permissions?.permissions?.is_system_admin || false,
    isOsztalyFonok: permissions?.permissions?.is_osztaly_fonok || false,
    
    // Can manage permissions
    canManageUsers: permissions?.permissions?.can_manage_users || false,
    canManageForgatas: permissions?.permissions?.can_manage_forgatas || false,
    canManageEquipment: permissions?.permissions?.can_manage_equipment || false,
    canManagePartners: permissions?.permissions?.can_manage_partners || false,
    canManageAnnouncements: permissions?.permissions?.can_manage_announcements || false,
    
    // View permissions
    canViewAllUsers: permissions?.permissions?.can_view_all_users || false,
    canViewAllForgatas: permissions?.permissions?.can_view_all_forgatas || false,
    
    // Radio permissions
    canParticipateInRadio: permissions?.permissions?.can_participate_in_radio || false,
    canManageRadioSessions: permissions?.permissions?.can_manage_radio_sessions || false,
    
    // Display properties
    showAdminMenu: permissions?.display_properties?.show_admin_menu || false,
    showTeacherMenu: permissions?.display_properties?.show_teacher_menu || false,
    showStudentMenu: permissions?.display_properties?.show_student_menu || false,
    showRadioMenu: permissions?.display_properties?.show_radio_menu || false,
    
    // Loading and error states
    isLoading,
    error,
    
    // Full permissions object for advanced usage
    permissions
  }
}

export default useAuth
