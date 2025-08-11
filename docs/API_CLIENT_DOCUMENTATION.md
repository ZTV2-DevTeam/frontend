# FTV API Client Documentation

This document provides comprehensive documentation for the FTV Frontend API client, which is automatically generated from the OpenAPI specification.

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Basic Usage](#basic-usage)
- [Available Endpoints](#available-endpoints)
- [Error Handling](#error-handling)
- [Helper Hooks](#helper-hooks)
- [Type Safety](#type-safety)
- [Examples](#examples)

## Overview

The API client provides a complete TypeScript interface to the FTV Backend API with:
- Full type safety with TypeScript interfaces
- Automatic JWT token management
- Built-in error handling
- React hooks for common operations
- Comprehensive coverage of all API endpoints

## Authentication

### Basic Authentication
```typescript
import { apiClient, authHelpers } from '@/lib/api'

// Login
const loginResult = await authHelpers.login('username', 'password')

// Check if authenticated
const isAuth = authHelpers.isAuthenticated()

// Get current user profile
const profile = await authHelpers.getProfile()

// Logout
await authHelpers.logout()
```

### Token Management
The client automatically manages JWT tokens:
- Stores tokens in localStorage and httpOnly cookies
- Includes tokens in Authorization headers
- Handles token refresh
- Clears tokens on logout

## Basic Usage

### Direct API Calls
```typescript
import { apiClient } from '@/lib/api'

// Get all partners
const partners = await apiClient.getPartners()

// Create a new filming session
const newSession = await apiClient.createFilmingSession({
  name: "Test Session",
  description: "Description",
  date: "2024-08-15",
  time_from: "10:00",
  time_to: "12:00",
  type: "rendes"
})

// Update a user
const updatedUser = await apiClient.updateUser(123, {
  first_name: "John",
  last_name: "Doe"
})
```

### Using React Hooks
```typescript
import { useApiQuery, useApiMutation } from '@/lib/api-helpers'

function PartnersComponent() {
  // Query hook for fetching data
  const { data: partners, loading, error } = useApiQuery(
    () => apiClient.getPartners()
  )

  // Mutation hook for creating data
  const createPartner = useApiMutation(
    (data) => apiClient.createPartner(data)
  )

  const handleCreate = async (formData) => {
    try {
      await createPartner.execute(formData)
      // Handle success
    } catch (error) {
      // Handle error
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {partners?.map(partner => (
        <div key={partner.id}>{partner.name}</div>
      ))}
    </div>
  )
}
```

## Available Endpoints

### Core & Authentication
- `hello(name?)` - Hello world test endpoint
- `testAuth()` - Test authentication status
- `getPermissions()` - Get user permissions
- `getTanevConfigStatus()` - Get configuration status
- `login(credentials)` - User login
- `getProfile()` - Get current user profile
- `dashboard()` - Get dashboard data
- `refreshToken()` - Refresh JWT token
- `logout()` - User logout
- `forgotPassword(data)` - Initiate password reset
- `verifyResetToken(token)` - Verify reset token
- `resetPassword(data)` - Complete password reset

### Partners
- `getPartners()` - Get all partners
- `getPartner(id)` - Get specific partner
- `createPartner(data)` - Create new partner
- `updatePartner(id, data)` - Update partner
- `deletePartner(id)` - Delete partner

### Radio
- `getRadioStabs()` - Get radio stabs
- `createRadioStab(data)` - Create radio stab
- `getRadioSessions(startDate?, endDate?)` - Get radio sessions
- `createRadioSession(data)` - Create radio session

### Users
- `getAllUsers()` - Get all users
- `getUserDetails(id)` - Get user details
- `getRadioStudents()` - Get radio students (9F)
- `checkUserAvailability(id, start, end)` - Check availability

### User Management (Admin)
- `getAllUsersDetailed(type?, classId?)` - Get detailed user list
- `createUser(data)` - Create new user
- `updateUser(id, data)` - Update user
- `deleteUser(id)` - Delete user
- `generateUserFirstLoginToken(id)` - Generate first login token
- `createBulkStudents(data)` - Create multiple students
- `verifyFirstLoginToken(token)` - Verify first login token
- `setFirstPassword(token, password, confirm)` - Set initial password

### Academic
- `getSchoolYears()` - Get all school years
- `getSchoolYear(id)` - Get specific school year
- `createSchoolYear(data)` - Create school year
- `getActiveSchoolYear()` - Get currently active school year
- `getClasses()` - Get all classes
- `getClass(id)` - Get specific class
- `createClass(data)` - Create new class
- `updateClass(id, data)` - Update class
- `deleteClass(id)` - Delete class
- `getClassesBySection(section)` - Get classes by section (A, B, F)

### Equipment
- `getEquipmentTypes()` - Get equipment types
- `createEquipmentType(data)` - Create equipment type
- `getEquipment(functionalOnly?)` - Get all equipment
- `getEquipmentDetails(id)` - Get equipment details
- `createEquipment(data)` - Create equipment
- `updateEquipment(id, data)` - Update equipment
- `deleteEquipment(id)` - Delete equipment
- `getEquipmentByType(typeId, functionalOnly?)` - Get equipment by type
- `checkEquipmentAvailability(id, start, end)` - Check availability

### Production
- `getContactPersons()` - Get contact persons
- `createContactPerson(data)` - Create contact person
- `getFilmingSessions(start?, end?, type?)` - Get filming sessions
- `getFilmingSession(id)` - Get specific filming session
- `createFilmingSession(data)` - Create filming session
- `updateFilmingSession(id, data)` - Update filming session
- `deleteFilmingSession(id)` - Delete filming session
- `getFilmingTypes()` - Get available filming types

### Communications
- `getAnnouncements(myOnly?)` - Get announcements
- `getPublicAnnouncements()` - Get public announcements
- `getAnnouncementDetails(id)` - Get announcement details
- `createAnnouncement(data)` - Create announcement
- `updateAnnouncement(id, data)` - Update announcement
- `deleteAnnouncement(id)` - Delete announcement
- `getAnnouncementRecipients(id)` - Get announcement recipients

### Organization
- `getStabs()` - Get all stabs (teams)
- `createStab(data)` - Create stab
- `getRoles(year?)` - Get roles
- `createRole(data)` - Create role
- `getRoleRelations(userId?, roleId?)` - Get role relations
- `createRoleRelation(data)` - Create role relation
- `deleteRoleRelation(id)` - Delete role relation
- `getAssignments(tanevId?, kesz?)` - Get assignments
- `getAssignmentDetails(id)` - Get assignment details
- `createAssignment(data)` - Create assignment
- `deleteAssignment(id)` - Delete assignment
- `toggleAssignmentCompletion(id)` - Toggle assignment completion

### Absence
- `getAbsences(userId?, start?, end?, myOnly?)` - Get absences
- `getAbsenceDetails(id)` - Get absence details
- `createAbsence(data)` - Create absence
- `updateAbsence(id, data)` - Update absence
- `deleteAbsence(id)` - Delete absence
- `approveAbsence(id)` - Approve absence
- `denyAbsence(id)` - Deny absence
- `checkUserAbsenceConflicts(userId, start, end)` - Check conflicts

### Configuration (Admin)
- `getConfigurations()` - Get all configurations
- `getConfiguration(id)` - Get specific configuration
- `createConfiguration(data)` - Create configuration
- `updateConfiguration(id, data)` - Update configuration
- `deleteConfiguration(id)` - Delete configuration
- `getCurrentConfiguration()` - Get current configuration
- `updateCurrentConfiguration(data)` - Update current configuration
- `toggleConfigurationActive(id)` - Toggle active status
- `toggleConfigurationEmails(id)` - Toggle email permissions
- `getSystemStatus()` - Get system status

## Error Handling

### Basic Error Handling
```typescript
import { errorUtils } from '@/lib/api-helpers'

try {
  const result = await apiClient.getPartners()
} catch (error) {
  const message = errorUtils.getErrorMessage(error)
  
  if (errorUtils.isAuthError(error)) {
    // Handle authentication error
    router.push('/login')
  } else if (errorUtils.isPermissionError(error)) {
    // Handle permission error
    showError('You do not have permission to perform this action')
  } else {
    // Handle other errors
    showError(message)
  }
}
```

### Using Error Helpers
```typescript
import { errorUtils } from '@/lib/api-helpers'

// Extract user-friendly error message
const message = errorUtils.getErrorMessage(error)

// Check if error is authentication related
const isAuthError = errorUtils.isAuthError(error)

// Check if error is permission related  
const isPermissionError = errorUtils.isPermissionError(error)
```

## Helper Hooks

### useApiQuery Hook
```typescript
import { useApiQuery } from '@/lib/api-helpers'

function MyComponent() {
  const { data, loading, error } = useApiQuery(
    () => apiClient.getPartners(),
    [] // dependencies
  )

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {data && <div>{data.length} partners found</div>}
    </div>
  )
}
```

### useApiMutation Hook
```typescript
import { useApiMutation } from '@/lib/api-helpers'

function CreatePartnerForm() {
  const createPartner = useApiMutation(
    (data) => apiClient.createPartner(data)
  )

  const handleSubmit = async (formData) => {
    try {
      const newPartner = await createPartner.execute(formData)
      console.log('Created:', newPartner)
    } catch (error) {
      console.error('Failed to create partner:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button 
        type="submit" 
        disabled={createPartner.loading}
      >
        {createPartner.loading ? 'Creating...' : 'Create Partner'}
      </button>
      {createPartner.error && (
        <div className="error">{createPartner.error}</div>
      )}
    </form>
  )
}
```

## Type Safety

### Using TypeScript Interfaces
```typescript
import { 
  PartnerCreateSchema, 
  UserDetailSchema,
  ForgatCreateSchema 
} from '@/lib/types'

// Type-safe partner creation
const partnerData: PartnerCreateSchema = {
  name: "Test Partner",
  address: "Test Address",
  institution: "Test Institution"
}

// Type-safe user handling
function handleUser(user: UserDetailSchema) {
  console.log(`User: ${user.full_name} (${user.email})`)
  if (user.is_active) {
    console.log('User is active')
  }
}

// Type-safe filming session creation
const sessionData: ForgatCreateSchema = {
  name: "Test Session",
  description: "Test Description",
  date: "2024-08-15",
  time_from: "10:00",
  time_to: "12:00",
  type: "rendes"
}
```

## Examples

### Complete Component Example
```typescript
import React, { useState } from 'react'
import { useApiQuery, useApiMutation } from '@/lib/api-helpers'
import { apiClient } from '@/lib/api'
import { PartnerSchema, PartnerCreateSchema } from '@/lib/types'

function PartnersManager() {
  const [showForm, setShowForm] = useState(false)
  
  // Fetch partners
  const { 
    data: partners, 
    loading, 
    error 
  } = useApiQuery(() => apiClient.getPartners())

  // Create partner mutation
  const createPartner = useApiMutation(
    (data: PartnerCreateSchema) => apiClient.createPartner(data)
  )

  // Delete partner mutation
  const deletePartner = useApiMutation(
    (id: number) => apiClient.deletePartner(id)
  )

  const handleCreate = async (formData: PartnerCreateSchema) => {
    try {
      await createPartner.execute(formData)
      setShowForm(false)
      // Optionally refetch data or update state
    } catch (error) {
      console.error('Failed to create partner:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        await deletePartner.execute(id)
        // Optionally refetch data or update state
      } catch (error) {
        console.error('Failed to delete partner:', error)
      }
    }
  }

  if (loading) return <div>Loading partners...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Partners</h1>
      
      <button onClick={() => setShowForm(true)}>
        Add Partner
      </button>

      <div className="partners-list">
        {partners?.map((partner: PartnerSchema) => (
          <div key={partner.id} className="partner-card">
            <h3>{partner.name}</h3>
            <p>{partner.address}</p>
            {partner.institution && <p>{partner.institution}</p>}
            
            <button 
              onClick={() => handleDelete(partner.id)}
              disabled={deletePartner.loading}
            >
              {deletePartner.loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        ))}
      </div>

      {showForm && (
        <PartnerForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          loading={createPartner.loading}
          error={createPartner.error}
        />
      )}
    </div>
  )
}

// Form component
function PartnerForm({ onSubmit, onCancel, loading, error }) {
  const [formData, setFormData] = useState<PartnerCreateSchema>({
    name: '',
    address: '',
    institution: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Partner Name"
        value={formData.name}
        onChange={(e) => setFormData({
          ...formData, 
          name: e.target.value
        })}
        required
      />
      
      <input
        type="text"
        placeholder="Address"
        value={formData.address}
        onChange={(e) => setFormData({
          ...formData, 
          address: e.target.value
        })}
      />
      
      <input
        type="text"
        placeholder="Institution"
        value={formData.institution}
        onChange={(e) => setFormData({
          ...formData, 
          institution: e.target.value
        })}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Partner'}
      </button>
      
      <button type="button" onClick={onCancel}>
        Cancel
      </button>

      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default PartnersManager
```

### Authentication Flow Example
```typescript
import { useState } from 'react'
import { authHelpers } from '@/lib/api-helpers'
import { useRouter } from 'next/navigation'

function LoginForm() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await authHelpers.login(
        credentials.username, 
        credentials.password
      )
      
      console.log('Login successful:', result)
      router.push('/app/iranyitopult') // Redirect to dashboard
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Username"
        value={credentials.username}
        onChange={(e) => setCredentials({
          ...credentials,
          username: e.target.value
        })}
        required
      />
      
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({
          ...credentials,
          password: e.target.value
        })}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {error && <div className="error">{error}</div>}
    </form>
  )
}
```

## Best Practices

1. **Always use TypeScript types** for API calls to ensure type safety
2. **Handle errors appropriately** using the provided error utilities  
3. **Use React hooks** for component-level API state management
4. **Cache responses** when appropriate using the provided cache utilities
5. **Validate data** before sending to the API using the provided validators
6. **Use the authentication helpers** for consistent auth handling across your app

## Support

For questions or issues with the API client, please refer to:
- The OpenAPI specification for detailed endpoint documentation
- TypeScript types in `@/lib/types` for data structure details
- Helper functions in `@/lib/api-helpers` for common operations

The API client is automatically generated from the OpenAPI spec, so it should always be up-to-date with the backend API.
