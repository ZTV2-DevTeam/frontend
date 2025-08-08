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

  // Generic API methods for custom routes
  async get<T = any>(route: string): Promise<T> {
    return this.request<T>(`/api/${route}`)
  }

  async post<T = any>(route: string, data?: any): Promise<T> {
    return this.request<T>(`/api/${route}`, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T = any>(route: string, data?: any): Promise<T> {
    return this.request<T>(`/api/${route}`, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T = any>(route: string, data?: any): Promise<T> {
    return this.request<T>(`/api/${route}`, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T = any>(route: string): Promise<T> {
    return this.request<T>(`/api/${route}`, {
      method: 'DELETE',
    })
  }

  isAuthenticated(): boolean {
    return !!this.token
  }
}

export const apiClient = new ApiClient(API_CONFIG.BASE_URL)
