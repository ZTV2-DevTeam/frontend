import { ProtectedRoute } from '@/components/protected-route'
import { useAuth } from '@/hooks/use-permissions'

// Example 1: Simple page protection
export default function AdminOnlyPage() {
  return (
    <ProtectedRoute requiredPermission="is_admin">
      <div>
        <h1>Admin Only Content</h1>
        <p>Only administrators can see this page.</p>
      </div>
    </ProtectedRoute>
  )
}

// Example 2: Multiple permission checks within a component
export function DashboardWidgets() {
  const {
    canManageUsers,
    canManageForgatas,
    canManageEquipment,
    showAdminMenu,
    showTeacherMenu,
    showStudentMenu,
    primaryRole,
    roles
  } = useAuth()

  return (
    <div className="grid gap-4">
      <div className="mb-4">
        <h2>Welcome, {primaryRole}</h2>
        <p>Your roles: {roles.join(', ')}</p>
      </div>

      {/* Admin widgets */}
      {showAdminMenu && (
        <div className="admin-section">
          <h3>Administration</h3>
          {canManageUsers && (
            <div className="widget">
              <h4>User Management</h4>
              <p>Manage system users</p>
            </div>
          )}
          {canManageEquipment && (
            <div className="widget">
              <h4>Equipment Management</h4>
              <p>Manage equipment inventory</p>
            </div>
          )}
        </div>
      )}

      {/* Teacher widgets */}
      {showTeacherMenu && (
        <div className="teacher-section">
          <h3>Teaching Tools</h3>
          {canManageForgatas && (
            <div className="widget">
              <h4>Filming Sessions</h4>
              <p>Manage filming sessions</p>
            </div>
          )}
        </div>
      )}

      {/* Student widgets - always shown */}
      {showStudentMenu && (
        <div className="student-section">
          <h3>Student Tools</h3>
          <div className="widget">
            <h4>My Schedule</h4>
            <p>View your schedule</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Example 3: Page with fallback for unauthorized users
export default function ConditionalAccessPage() {
  return (
    <ProtectedRoute 
      requiredPermission="can_view_all_forgatas"
      showFallback={true}
    >
      <div>
        <h1>All Filming Sessions</h1>
        <p>This page shows all filming sessions in the system.</p>
      </div>
    </ProtectedRoute>
  )
}

// Example 4: Custom permission checking component
export function ConditionalButton() {
  const { hasPermission, canManageUsers } = useAuth()
  
  // Method 1: Using the hook shortcut
  if (!canManageUsers) {
    return null
  }

  // Method 2: Using explicit permission check
  if (!hasPermission('can_manage_users')) {
    return null
  }

  return (
    <button onClick={() => console.log('Managing users...')}>
      Manage Users
    </button>
  )
}

// Example 5: Navigation with permission filtering
export function CustomNavigation() {
  const { canAccessPage, canManageUsers, canManageForgatas } = useAuth()
  
  const navItems = [
    { href: '/app/iranyitopult', label: 'Dashboard', permission: null },
    { href: '/app/stab', label: 'Staff Management', permission: 'can_manage_users' },
    { href: '/app/forgatasok', label: 'Filming Sessions', permission: 'can_manage_forgatas' },
    { href: '/app/felszereles', label: 'Equipment', permission: null }, // Accessible to students too
  ]

  return (
    <nav>
      {navItems.map(item => {
        // Check page access
        if (!canAccessPage(item.href)) {
          return null
        }

        // Check specific permission if required
        if (item.permission && !hasPermission(item.permission)) {
          return null
        }

        return (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        )
      })}
    </nav>
  )
}
