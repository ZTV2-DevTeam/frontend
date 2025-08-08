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
// - Forgatasok (Shoots)
// - Felszereles (Equipment)
// - etc.
