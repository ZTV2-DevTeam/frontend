// API Types for different endpoints

// Partner types
export interface Partner {
  id?: number
  name: string
  location: string
  imageURL?: string
  institutionType: string
  description?: string
  contactEmail?: string
  contactPhone?: string
  website?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreatePartnerRequest {
  name: string
  location: string
  institutionType: string
  imageURL?: string
  description?: string
  contactEmail?: string
  contactPhone?: string
  website?: string
}

export interface UpdatePartnerRequest extends Partial<CreatePartnerRequest> {
  id: number
}

// Forgatás (Shoot) types
export interface Forgatas {
  id: number
  title: string
  type: string
  status: 'active' | 'pending' | 'completed' | 'planning'
  date: string
  location: string
  description?: string
  assigned_students: string[]
  equipment: string[]
}

export interface CreateForgatásRequest {
  title: string
  type: string
  date: string
  location: string
  description?: string
}

export interface UpdateForgatásRequest extends Partial<CreateForgatásRequest> {
  id: number
  assigned_students?: string[]
  equipment?: string[]
  status?: 'active' | 'pending' | 'completed' | 'planning'
}

// Dashboard types
export interface DashboardStats {
  totalForgatások: number
  activeUsers: number
  pendingApprovals: number
  completedThisMonth: number
}

export interface ActivityItem {
  id: number
  action: string
  time: string
  type: 'application' | 'approval' | 'update' | 'request' | 'assignment'
}

export interface ChartData {
  month: string
  forgatások: number
  beosztások: number
}

export interface StatusData {
  name: string
  value: number
  color: string
}

// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Assignment types
export interface AssignmentRole {
  role: string
  needed: number
  assigned: number
}

export interface AssignedStudent {
  id: number
  name: string
  role: string
  class: string
  status: 'confirmed' | 'pending' | 'declined'
  skills: string[]
}

export interface Assignment {
  id: number
  shootingId: number
  shootingTitle: string
  date: string
  time: string
  location: string
  requiredRoles: AssignmentRole[]
  assignedStudents: AssignedStudent[]
  status: 'complete' | 'incomplete'
  priority: 'low' | 'medium' | 'high'
  autoAssigned: boolean
}

// Equipment types
export interface Equipment {
  id: number
  name: string
  category: string
  status: 'available' | 'in-use' | 'maintenance' | 'broken'
  location?: string
  serialNumber?: string
  assignedTo?: string
  condition?: string
}

// Calendar Event types
export interface CalendarEvent {
  id: number
  title: string
  date: string
  time?: string
  type: string
  description?: string
  location?: string
  status: string
  participants: number
  crew: string
  organizer: string
  equipment: string[]
}

// Show types for Kacsa page
export interface Show {
  id: number
  title: string
  type: string
  status: string
  thumbnail?: string
  duration?: string
  description?: string
  createdAt: string
}

// Navigation types
export interface NavItem {
  name: string
  url: string
  icon?: React.ComponentType<{ className?: string }>
  external?: boolean
  isActive?: boolean
  items?: NavItem[]
}

// You can add more types here for other endpoints like:
// - Igazolások (Certificates)
// - etc.
