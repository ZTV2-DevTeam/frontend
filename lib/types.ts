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

// You can add more types here for other endpoints like:
// - Felszereles (Equipment)
// - Igazolások (Certificates)
// - etc.
