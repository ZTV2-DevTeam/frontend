import { API_CONFIG } from './config'

// API Types based on OpenAPI spec
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user_id: number
  username: string
  first_name: string
  last_name: string
  email: string
}

export interface ErrorResponse {
  message: string
}

export interface User {
  user_id: number
  username: string
  first_name: string
  last_name: string
  email: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

// API Client class
class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.token = this.getStoredToken()
  }

  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      // Try localStorage first
      const localToken = localStorage.getItem('jwt_token')
      if (localToken) return localToken
      
      // Fallback to cookies
      const cookieToken = document.cookie
        .split(';')
        .find(cookie => cookie.trim().startsWith('jwt_token='))
        ?.split('=')[1]
      
      return cookieToken || null
    }
    return null
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('jwt_token', token)
        // Also set as httpOnly cookie for middleware
        document.cookie = `jwt_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`
      } else {
        localStorage.removeItem('jwt_token')
        // Remove cookie
        document.cookie = 'jwt_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`
      }))
      throw new Error(errorData.message || 'API request failed')
    }

    return response.json()
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const formData = new FormData()
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)

    const response = await fetch(`${this.baseUrl}/api/login`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`
      }))
      throw new Error(errorData.message || 'Login failed')
    }

    const data = await response.json()
    this.setToken(data.token)
    return data
  }

  async getProfile(): Promise<LoginResponse> {
    return this.request<LoginResponse>('/api/profile')
  }

  async refreshToken(): Promise<{ token: string }> {
    const data = await this.request<{ token: string }>('/api/refresh-token', {
      method: 'POST',
    })
    this.setToken(data.token)
    return data
  }

  async logout(): Promise<void> {
    try {
      await this.request('/api/logout', { method: 'POST' })
    } finally {
      this.setToken(null)
    }
  }

  async testAuth(): Promise<unknown> {
    return this.request('/api/test-auth')
  }

  async dashboard(): Promise<unknown> {
    return this.request('/api/dashboard')
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    return this.request('/api/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    return this.request('/api/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async verifyResetToken(token: string): Promise<{ valid: boolean }> {
    return this.request(`/api/verify-reset-token/${token}`)
  }

  // First Steps / Setup API methods
  async getSetupStatus(): Promise<{ needs_setup: boolean, missing_configs?: string[] }> {
    return this.request('/api/setup-status')
  }

  async saveSchoolYear(data: { start_date: string, end_date: string }): Promise<{ success: boolean }> {
    return this.request('/api/setup/school-year', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async saveClasses(classes: Array<{ starting_year: number, section: string }>): Promise<{ success: boolean }> {
    return this.request('/api/setup/classes', {
      method: 'POST',
      body: JSON.stringify({ classes }),
    })
  }

  async saveStaffs(staffs: Array<{ name: string }>): Promise<{ success: boolean }> {
    return this.request('/api/setup/staffs', {
      method: 'POST',
      body: JSON.stringify({ staffs }),
    })
  }

  async saveStudents(students: Array<any>): Promise<{ success: boolean }> {
    return this.request('/api/setup/students', {
      method: 'POST',
      body: JSON.stringify({ students }),
    })
  }

  async saveTeachers(teachers: Array<any>): Promise<{ success: boolean }> {
    return this.request('/api/setup/teachers', {
      method: 'POST',
      body: JSON.stringify({ teachers }),
    })
  }

  async savePartners(partners: Array<any>): Promise<{ success: boolean }> {
    return this.request('/api/setup/partners', {
      method: 'POST',
      body: JSON.stringify({ partners }),
    })
  }

  async saveEquipment(equipment: Array<any>): Promise<{ success: boolean }> {
    return this.request('/api/setup/equipment', {
      method: 'POST',
      body: JSON.stringify({ equipment }),
    })
  }

  async completeSetup(settings: { email_notifications: boolean }): Promise<{ success: boolean }> {
    return this.request('/api/setup/complete', {
      method: 'POST',
      body: JSON.stringify(settings),
    })
  }

  async createTeacher(teacher: any): Promise<{ success: boolean, teacher_id: string }> {
    return this.request('/api/setup/create-teacher', {
      method: 'POST',
      body: JSON.stringify(teacher),
    })
  }

  async getTeacherRegistrationLink(teacherId: string): Promise<{ registration_link: string }> {
    return this.request(`/api/setup/teacher-registration-link/${teacherId}`)
  }

  async sendStudentRegistrationEmails(classData: { class_year: number, class_section: string }): Promise<{ success: boolean, sent_count: number }> {
    return this.request('/api/setup/send-student-emails', {
      method: 'POST',
      body: JSON.stringify(classData),
    })
  }

  // Generic API methods for custom routes
  async get<T = unknown>(route: string): Promise<T> {
    return this.request<T>(`/api/${route}`)
  }

  async post<T = unknown>(route: string, data?: Record<string, unknown>): Promise<T> {
    return this.request<T>(`/api/${route}`, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T = unknown>(route: string, data?: Record<string, unknown>): Promise<T> {
    return this.request<T>(`/api/${route}`, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T = unknown>(route: string, data?: Record<string, unknown>): Promise<T> {
    return this.request<T>(`/api/${route}`, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T = unknown>(route: string): Promise<T> {
    return this.request<T>(`/api/${route}`, {
      method: 'DELETE',
    })
  }

  isAuthenticated(): boolean {
    return !!this.token
  }
}

export const apiClient = new ApiClient(API_CONFIG.BASE_URL)
