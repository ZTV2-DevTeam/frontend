# Permissions System Documentation

## Overview

The frontend now implements a comprehensive permissions-based access control system that integrates with the backend `/api/permissions` endpoint. This system controls which pages users can see and which actions they can perform based on their roles and permissions.

## Key Components

### 1. Permissions Context (`contexts/permissions-context.tsx`)
- Fetches user permissions from the backend
- Provides permission checking functions
- Manages available roles for each user

### 2. Team Switcher (`components/team-switcher.tsx`)
- Only shows roles that the user has permission to use
- For users with only one role, removes the dropdown entirely and shows a static display
- Removes the "New Role" button completely (users cannot create new roles)

### 3. App Sidebar (`components/app-sidebar.tsx`)
- Filters navigation items based on user permissions
- Only shows pages the user can access
- Dynamically builds navigation based on permissions

### 4. Protected Route (`components/protected-route.tsx`)
- Wraps pages that require specific permissions
- Shows appropriate error messages for unauthorized access
- Handles loading states and authentication checks

### 5. Role Synchronizer (`components/role-synchronizer.tsx`)
- Automatically sets the user's initial role based on their primary role from the backend
- Runs once when permissions are loaded

## How It Works

### 1. Permission Loading
When a user logs in, the system:
1. Authenticates the user
2. Fetches permissions from `/api/permissions`
3. Determines available roles and primary role
4. Sets up the navigation and UI based on permissions

### 2. Role Switching
- Users can only switch between roles they have permission for
- If a user has only one role (admin, teacher, or student), the team switcher becomes static
- Role switching navigates to the dashboard automatically

### 3. Page Access Control
Pages are protected based on backend logic:
- **Admin pages** (like `/app/stab`): Require `can_manage_users` or admin permissions
- **Teacher pages**: Require teacher admin or class management permissions
- **Student pages**: Generally accessible but may have limited functionality

### 4. Navigation Filtering
The sidebar dynamically shows/hides navigation items based on:
- User's current role selection
- Backend permissions for each page
- Display properties from the backend

## Backend Integration

The system integrates with the backend permissions algorithm:

```python
# Backend returns comprehensive permissions
{
  "user_info": { ... },
  "permissions": {
    "is_admin": bool,
    "can_manage_users": bool,
    "can_manage_forgatas": bool,
    # ... more permissions
  },
  "display_properties": {
    "show_admin_menu": bool,
    "navigation_items": [...],
    # ... display settings
  },
  "role_info": {
    "primary_role": str,
    "roles": [...],
    "admin_type": str,
    # ... role information
  }
}
```

## Permission Checking

### In Components
```typescript
import { usePermissions } from '@/contexts/permissions-context'

function MyComponent() {
  const { hasPermission, canAccessPage } = usePermissions()
  
  if (!hasPermission('can_manage_users')) {
    return <div>No access</div>
  }
  
  return <div>Content</div>
}
```

### Using the Hook
```typescript
import { useAuth } from '@/hooks/use-permissions'

function MyComponent() {
  const { isAdmin, canManageUsers, showAdminMenu } = useAuth()
  
  return (
    <div>
      {isAdmin && <AdminPanel />}
      {canManageUsers && <UserManagement />}
    </div>
  )
}
```

### Page Protection
```typescript
export default function AdminPage() {
  return (
    <ProtectedRoute requiredPermission="can_manage_users">
      <AdminContent />
    </ProtectedRoute>
  )
}
```

## Role Types

### Frontend Roles
- `admin`: Full administrative access
- `class-teacher`: Teacher with class management permissions
- `student`: Basic user access

### Backend Role Mapping
- `system_admin` / `developer_admin` → `admin`
- `teacher_admin` / `osztaly_fonok` → `class-teacher`
- Everyone else → `student` (with varying permissions)

## Key Features

1. **Dynamic Navigation**: Only shows accessible pages
2. **Role-Based Team Switcher**: Shows only available roles
3. **Permission-Based Content**: Components can check specific permissions
4. **Automatic Role Detection**: Sets initial role based on backend primary role
5. **Graceful Fallbacks**: Appropriate error messages for unauthorized access
6. **Loading States**: Proper loading indicators during permission fetching

## Security Notes

- All permission checks are backed by the backend
- Frontend permissions are for UX only - backend enforces actual security
- Permissions are fetched fresh on each session
- Invalid or expired tokens automatically redirect to login

## Example Usage

### Protecting a Page
```typescript
export default function StabPage() {
  return (
    <ProtectedRoute requiredPermission="can_manage_users">
      <StabPageContent />
    </ProtectedRoute>
  )
}
```

### Conditional Rendering
```typescript
function Navigation() {
  const { canManageUsers, canManageForgatas } = useAuth()
  
  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
      {canManageUsers && <Link href="/users">Users</Link>}
      {canManageForgatas && <Link href="/forgatas">Forgatas</Link>}
    </nav>
  )
}
```

### Role-Specific Content
```typescript
function Dashboard() {
  const { primaryRole, showAdminMenu, showTeacherMenu } = useAuth()
  
  return (
    <div>
      <h1>Welcome, {primaryRole}</h1>
      {showAdminMenu && <AdminDashboard />}
      {showTeacherMenu && <TeacherDashboard />}
      <StudentDashboard />
    </div>
  )
}
```
