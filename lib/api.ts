import { API_CONFIG, DEBUG_CONFIG, ENV_UTILS } from './config'

// === AUTHENTICATION & CORE TYPES ===
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

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

export interface UserPermissionsSchema {
  user_info: Record<string, any>
  permissions: Record<string, any>
  display_properties: Record<string, any>
  role_info: Record<string, any>
}

export interface TanevConfigStatusSchema {
  config_necessary: boolean
  system_admin_setup_required: boolean
  current_tanev?: Record<string, any>
  missing_components: string[]
  setup_steps: Record<string, any>[]
}

// === PARTNERS ===
export interface PartnerSchema {
  id: number
  name: string
  address: string
  institution?: string
  imageURL?: string
}

export interface PartnerCreateSchema {
  name: string
  address?: string
  institution?: string
  imageURL?: string
}

export interface PartnerUpdateSchema {
  name?: string
  address?: string
  institution?: string
  imageURL?: string
}

// === RADIO ===
export interface RadioStabSchema {
  id: number
  name: string
  team_code: string
  description?: string
  member_count: number
}

export interface RadioStabCreateSchema {
  name: string
  team_code: string
  description?: string
}

export interface RadioSessionSchema {
  id: number
  radio_stab: RadioStabSchema
  date: string
  time_from: string
  time_to: string
  description?: string
  participant_count: number
}

export interface RadioSessionCreateSchema {
  radio_stab_id: number
  date: string
  time_from: string
  time_to: string
  description?: string
  participant_ids: number[]
}

// === USERS ===
export interface UserBasicSchema {
  id: number
  username: string
  first_name: string
  last_name: string
  full_name: string
}

export interface UserProfileSchema {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  telefonszam?: string
  medias: boolean
  admin_type: string
  stab_name?: string
  radio_stab_name?: string
  osztaly_name?: string
  is_second_year_radio: boolean
}

export interface UserDetailSchema {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  full_name: string
  is_active: boolean
  admin_type: string
  special_role: string
  telefonszam?: string
  osztaly?: Record<string, any>
  stab?: Record<string, any>
  radio_stab?: Record<string, any>
  medias: boolean
  password_set: boolean
  first_login_token_sent: boolean
  date_joined: string
  last_login?: string
}

export interface UserCreateSchema {
  username: string
  first_name: string
  last_name: string
  email: string
  admin_type?: string
  special_role?: string
  telefonszam?: string
  osztaly_id?: number
  stab_id?: number
  radio_stab_id?: number
  medias?: boolean
}

export interface UserUpdateSchema {
  username?: string
  first_name?: string
  last_name?: string
  email?: string
  admin_type?: string
  special_role?: string
  telefonszam?: string
  osztaly_id?: number
  stab_id?: number
  radio_stab_id?: number
  medias?: boolean
  is_active?: boolean
}

// === ACADEMIC ===
export interface TanevSchema {
  id: number
  start_date: string
  end_date: string
  start_year: number
  end_year: number
  display_name: string
  is_active: boolean
  osztaly_count: number
}

export interface TanevCreateSchema {
  start_date: string
  end_date: string
}

export interface OsztalySchema {
  id: number
  start_year: number
  szekcio: string
  display_name: string
  current_display_name?: string
  tanev?: TanevSchema
  student_count: number
}

export interface OsztalyCreateSchema {
  start_year: number
  szekcio: string
  tanev_id?: number
}

export interface OsztalyUpdateSchema {
  start_year?: number
  szekcio?: string
  tanev_id?: number
}

// === EQUIPMENT ===
export interface EquipmentTipusSchema {
  id: number
  name: string
  emoji?: string
  equipment_count: number
}

export interface EquipmentTipusCreateSchema {
  name: string
  emoji?: string
}

export interface EquipmentSchema {
  id: number
  nickname: string
  brand?: string
  model?: string
  serial_number?: string
  equipment_type?: EquipmentTipusSchema
  functional: boolean
  notes?: string
  display_name: string
}

export interface EquipmentCreateSchema {
  nickname: string
  brand?: string
  model?: string
  serial_number?: string
  equipment_type_id?: number
  functional?: boolean
  notes?: string
}

export interface EquipmentUpdateSchema {
  nickname?: string
  brand?: string
  model?: string
  serial_number?: string
  equipment_type_id?: number
  functional?: boolean
  notes?: string
}

export interface EquipmentAvailabilitySchema {
  equipment_id: number
  available: boolean
  conflicts: Record<string, any>[]
}

export interface EquipmentScheduleSchema {
  equipment_id: number
  equipment_name: string
  schedule: {
    date: string
    time_from: string
    time_to: string
    forgatas_name: string
    forgatas_id: number
    forgatas_type: string
    location: string
    available: boolean
  }[]
}

export interface EquipmentUsageSchema {
  equipment_id: number
  equipment_name: string
  total_bookings: number
  upcoming_bookings: number
  usage_hours: number
  most_recent_use: string
  next_booking?: {
    forgatas_id: number
    forgatas_name: string
    date: string
    time_from: string
    time_to: string
    location: string
  }
}

export interface EquipmentOverviewSchema {
  equipment_id: number
  equipment_name: string
  equipment_type: string
  functional: boolean
  available_periods: boolean
  bookings: {
    forgatas_id: number
    forgatas_name: string
    time_from: string
    time_to: string
    type: string
    location: string
  }[]
  booking_count: number
}

// === PRODUCTION ===
export interface ContactPersonSchema {
  id: number
  name: string
  email?: string
  phone?: string
}

export interface ContactPersonCreateSchema {
  name: string
  email?: string
  phone?: string
}

export interface ForgatSchema {
  id: number
  name: string
  description: string
  date: string
  time_from: string
  time_to: string
  location?: Record<string, any>
  contact_person?: ContactPersonSchema
  notes?: string
  type: string
  type_display: string
  related_kacsa?: Record<string, any>
  equipment_ids: number[]
  equipment_count: number
  tanev?: Record<string, any>
}

export interface ForgatCreateSchema {
  name: string
  description: string
  date: string
  time_from: string
  time_to: string
  location_id?: number
  contact_person_id?: number
  notes?: string
  type: string
  related_kacsa_id?: number
  equipment_ids?: number[]
}

export interface ForgatUpdateSchema {
  name?: string
  description?: string
  date?: string
  time_from?: string
  time_to?: string
  location_id?: number
  contact_person_id?: number
  notes?: string
  type?: string
  related_kacsa_id?: number
  equipment_ids?: number[]
}

export interface ForgatoTipusSchema {
  value: string
  label: string
}

// === COMMUNICATIONS ===
export interface AnnouncementSchema {
  id: number
  title: string
  body: string
  author?: UserBasicSchema
  created_at: string
  updated_at: string
  recipient_count: number
  is_targeted: boolean
}

export interface AnnouncementDetailSchema extends AnnouncementSchema {
  recipients: UserBasicSchema[]
}

export interface AnnouncementCreateSchema {
  title: string
  body: string
  recipient_ids?: number[]
}

export interface AnnouncementUpdateSchema {
  title?: string
  body?: string
  recipient_ids?: number[]
}

// === ORGANIZATION ===
export interface StabSchema {
  id: number
  name: string
  member_count: number
}

export interface StabCreateSchema {
  name: string
}

export interface SzerepkorSchema {
  id: number
  name: string
  ev?: number
  year_display?: string
}

export interface SzerepkorCreateSchema {
  name: string
  ev?: number
}

export interface SzerepkorRelacioSchema {
  id: number
  user: UserBasicSchema
  szerepkor: SzerepkorSchema
}

export interface SzerepkorRelacioCreateSchema {
  user_id: number
  szerepkor_id: number
}

export interface BeosztasSchema {
  id: number
  kesz: boolean
  author?: UserBasicSchema
  tanev?: Record<string, any>
  created_at: string
  role_relation_count: number
}

export interface BeosztasDetailSchema extends BeosztasSchema {
  szerepkor_relaciok: SzerepkorRelacioSchema[]
}

export interface BeosztasCreateSchema {
  kesz?: boolean
  tanev_id?: number
  szerepkor_relacio_ids?: number[]
}

// === ABSENCE ===
export interface TavolletSchema {
  id: number
  user: UserBasicSchema
  start_date: string
  end_date: string
  reason?: string
  denied: boolean
  duration_days: number
  status: string
}

export interface TavolletCreateSchema {
  user_id?: number
  start_date: string
  end_date: string
  reason?: string
}

export interface TavolletUpdateSchema {
  start_date?: string
  end_date?: string
  reason?: string
  denied?: boolean
}

// === CONFIGURATION ===
export interface ConfigSchema {
  id: number
  active: boolean
  allow_emails: boolean
  status: string
}

export interface ConfigUpdateSchema {
  active?: boolean
  allow_emails?: boolean
}

// === USER MANAGEMENT ===
export interface FirstLoginTokenResponse {
  user_id: number
  username: string
  full_name: string
  token_url: string
  token: string
  expires_at: string
}

export interface BulkEmailResponse {
  total_users: number
  emails_sent: number
  failed_emails: string[]
  tokens_generated: number
}

export interface BulkStudentCreateSchema {
  osztaly_id: number
  students: Record<string, any>[]
  send_emails?: boolean
}

// API Client class
class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    // Initialize token as null, will be set when getStoredToken is called
    this.token = null
    // Only get stored token in browser environment
    if (typeof window !== 'undefined') {
      this.token = this.getStoredToken()
    }
  }

  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      // Try localStorage first
      const localToken = localStorage.getItem('jwt_token')
      if (localToken && localToken.trim() !== '' && localToken !== 'null') {
        return localToken.trim()
      }
      
      // Fallback to cookies
      const cookieToken = document.cookie
        .split(';')
        .find(cookie => cookie.trim().startsWith('jwt_token='))
        ?.split('=')[1]
      
      if (cookieToken && cookieToken.trim() !== '' && cookieToken !== 'null') {
        return decodeURIComponent(cookieToken.trim())
      }
    }
    return null
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token && token.trim() !== '') {
        const cleanToken = token.trim()
        localStorage.setItem('jwt_token', cleanToken)
        // Also set as httpOnly cookie for middleware - encode properly
        document.cookie = `jwt_token=${encodeURIComponent(cleanToken)}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`
      } else {
        localStorage.removeItem('jwt_token')
        // Remove cookie
        document.cookie = 'jwt_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    timeout: number = 30000 // 30 seconds default timeout
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token && this.token.trim() !== '') {
      const cleanToken = this.token.trim()
      // Ensure we don't double-add 'Bearer' prefix
      if (cleanToken.startsWith('Bearer ')) {
        headers.Authorization = cleanToken
      } else {
        headers.Authorization = `Bearer ${cleanToken}`
      }
    }

    // Log API calls in development/staging
    if (DEBUG_CONFIG.LOG_API_CALLS) {
      console.log(`🔗 API Request [${ENV_UTILS.getCurrentEnvironment()}]:`, {
        method: options.method || 'GET',
        url,
        baseUrl: this.baseUrl,
        hasAuthHeader: !!headers.Authorization,
        authHeaderPreview: headers.Authorization ? `${headers.Authorization.substring(0, 20)}...` : 'none',
        headers: DEBUG_CONFIG.ENABLED ? { ...headers, Authorization: headers.Authorization ? '[PRESENT]' : '[MISSING]' } : '[hidden]',
        body: options.body ? JSON.parse(options.body as string) : undefined,
        timeout
      })
    }

    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        mode: 'cors', // Explicitly set CORS mode
        credentials: 'omit', // Don't send credentials to avoid CORS preflight issues
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Log response in development
      if (DEBUG_CONFIG.LOG_API_CALLS) {
        console.log(`📡 API Response [${response.status}]:`, {
          url,
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        })
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`
        }))

        // Enhanced error logging
        if (DEBUG_CONFIG.ENABLED) {
          console.error(`❌ API Error [${ENV_UTILS.getCurrentEnvironment()}]:`, {
            url,
            status: response.status,
            statusText: response.statusText,
            errorData,
            headers: DEBUG_CONFIG.DETAILED_ERRORS ? headers : '[hidden]'
          })
        }

        // Handle specific error cases
        if (response.status === 401) {
          // First, try to refresh token from storage in case it was updated elsewhere
          const refreshedToken = this.refreshTokenFromStorage()
          
          if (DEBUG_CONFIG.ENABLED) {
            console.warn('🔄 401 Error - attempting token refresh:', {
              hadToken: !!this.token,
              refreshedToken: !!refreshedToken,
              tokenChanged: this.token !== refreshedToken
            })
          }
          
          // If token changed, retry the request once
          if (refreshedToken && refreshedToken !== this.token) {
            console.log('🔄 Retrying request with refreshed token')
            headers.Authorization = refreshedToken.startsWith('Bearer ') ? refreshedToken : `Bearer ${refreshedToken}`
            
            const retryResponse = await fetch(url, {
              ...options,
              headers,
              mode: 'cors',
              credentials: 'omit',
            })
            
            if (retryResponse.ok) {
              const data = await retryResponse.json()
              if (DEBUG_CONFIG.ENABLED && DEBUG_CONFIG.LOG_LEVEL === 'debug') {
                console.log(`✅ API Retry Success:`, { url, data })
              }
              return data
            }
          }
          
          // Check if this is a public endpoint that shouldn't require auth
          const publicEndpoints = [
            '/api/hello',
            '/api/test-auth', 
            '/api/partners',
            '/api/filming-sessions/types',
            '/api/first-login/verify-token',
            '/api/first-login/set-password',
            '/api/config/status'
          ]
          
          const isPublicEndpoint = publicEndpoints.some(publicPath => 
            endpoint.startsWith(publicPath)
          )
          
          if (isPublicEndpoint) {
            // For public endpoints, don't clear token and use specific error message
            throw new Error(errorData.message || 'Hitelesítési hiba történt.')
          } else {
            // For protected endpoints, clear invalid token
            this.setToken(null)
            throw new Error('A munkamenet lejárt. Kérjük, jelentkezzen be újra.')
          }
        } else if (response.status === 403) {
          throw new Error('Nincs jogosultsága ehhez a művelethez.')
        } else if (response.status === 404) {
          throw new Error('A kért erőforrás nem található.')
        } else if (response.status >= 500) {
          throw new Error('Szerverhiba történt. Kérjük, próbálja újra később.')
        }

        throw new Error(errorData.message || 'API request failed')
      }

      const data = await response.json()
      
      // Log successful response data in debug mode
      if (DEBUG_CONFIG.ENABLED && DEBUG_CONFIG.LOG_LEVEL === 'debug') {
        console.log(`✅ API Success:`, { url, data, isEmpty: Array.isArray(data) && data.length === 0 })
      }

      return data
    } catch (error) {
      clearTimeout(timeoutId)
      
      // Enhanced error handling with environment context
      if (DEBUG_CONFIG.ENABLED) {
        console.error(`💥 API Request Failed [${ENV_UTILS.getCurrentEnvironment()}]:`, {
          url,
          error: error instanceof Error ? error.message : String(error),
          baseUrl: this.baseUrl,
          environment: ENV_UTILS.getCurrentEnvironment(),
          isAbortError: error instanceof Error && error.name === 'AbortError'
        })
      }
      
      // Check for timeout/abort errors
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Kérés időtúllépés: A szerver nem válaszolt ${timeout / 1000} másodperc alatt. Kérjük, próbálja újra.`)
      }
      
      // Check for CORS errors specifically and provide helpful message
      if (error instanceof TypeError && 
          (error.message.includes('Failed to fetch') || 
           error.message.includes('NetworkError') ||
           error.message.includes('CORS'))) {
        const corsMessage = `Hálózati hiba: Nem sikerült csatlakozni a szerverhez (${this.baseUrl}). Ellenőrizze az internetkapcsolatot és próbálja újra.`
        console.error('🚫 Network Error Details:', {
          frontendOrigin: typeof window !== 'undefined' ? window.location.origin : 'unknown',
          backendUrl: this.baseUrl,
          error: error.message,
          suggestion: 'Check internet connection and server availability.'
        })
        throw new Error(corsMessage)
      }
      
      // Re-throw the error for the calling code
      throw error
    }
  }

  // === RETRY WRAPPER METHODS ===
  private async withRetry<T>(
    operation: () => Promise<T>,
    context: string,
    maxRetries: number = 3,
    timeout?: number
  ): Promise<T> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        // Don't retry on certain errors
        if (this.shouldNotRetry(lastError)) {
          throw lastError
        }

        // If this was the last attempt, throw the error
        if (attempt === maxRetries) {
          console.error(`❌ Final retry attempt failed for ${context}:`, lastError.message)
          throw lastError
        }

        const delay = Math.min(1000 * Math.pow(2, attempt), 10000) // Exponential backoff with max 10s
        console.warn(`⚠️ Attempt ${attempt + 1} failed for ${context}, retrying in ${delay}ms:`, lastError.message)
        
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw lastError || new Error('Maximum retries reached')
  }

  private shouldNotRetry(error: Error): boolean {
    // Don't retry on authentication errors
    if (error.message.includes('401') || error.message.includes('Unauthorized') || 
        error.message.includes('munkamenet lejárt')) {
      return true
    }

    // Don't retry on permission errors
    if (error.message.includes('403') || error.message.includes('Forbidden') ||
        error.message.includes('jogosultság')) {
      return true
    }

    // Don't retry on client errors (except timeout)
    if (error.message.includes('400') && !error.message.includes('időtúllépés')) {
      return true
    }

    return false
  }

  // Retry-enabled request wrapper
  private async requestWithRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    timeout?: number,
    maxRetries?: number
  ): Promise<T> {
    return this.withRetry(
      () => this.request<T>(endpoint, options, timeout),
      `${options.method || 'GET'} ${endpoint}`,
      maxRetries,
      timeout
    )
  }

  // === CORE & AUTH METHODS ===
  async hello(name?: string): Promise<any> {
    const params = name ? `?name=${encodeURIComponent(name)}` : ''
    return this.request(`/api/hello${params}`)
  }

  async testAuth(): Promise<any> {
    return this.request('/api/test-auth')
  }

  async getPermissions(): Promise<UserPermissionsSchema> {
    return this.requestWithRetry<UserPermissionsSchema>('/api/permissions', {}, 20000, 2) // 20s timeout, 2 retries
  }

  async getTanevConfigStatus(): Promise<TanevConfigStatusSchema> {
    return this.request<TanevConfigStatusSchema>('/api/tanev-config-status')
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Use URL-encoded form data as per OpenAPI specification
    const formData = new URLSearchParams()
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)

    try {
      // Log the request in development
      if (DEBUG_CONFIG.LOG_API_CALLS) {
        console.log('🔗 Login Request:', {
          url: `${this.baseUrl}/api/login`,
          username: credentials.username,
          method: 'POST'
        })
      }

      const response = await fetch(`${this.baseUrl}/api/login`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        }
      })

      // Log response status
      if (DEBUG_CONFIG.LOG_API_CALLS) {
        console.log('📡 Login Response:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries())
        })
      }

      if (!response.ok) {
        let errorData
        try {
          // Safely parse error response
          const responseText = await response.text()
          if (responseText) {
            errorData = JSON.parse(responseText)
          } else {
            errorData = { message: `HTTP ${response.status}: ${response.statusText}` }
          }
        } catch (parseError) {
          console.warn('Failed to parse error response:', parseError)
          errorData = { message: `HTTP ${response.status}: ${response.statusText}` }
        }
        
        // Enhanced error logging
        if (DEBUG_CONFIG.ENABLED) {
          console.error('❌ Login Error:', {
            status: response.status,
            statusText: response.statusText,
            errorData,
            url: `${this.baseUrl}/api/login`
          })
        }
        
        throw new Error(errorData.message || 'Login failed')
      }

      // Safely parse success response
      let data
      try {
        const responseText = await response.text()
        if (responseText) {
          data = JSON.parse(responseText)
        } else {
          throw new Error('Empty response from server')
        }
      } catch (parseError) {
        console.error('Failed to parse success response:', parseError)
        throw new Error('Invalid response format from server')
      }

      // Validate response structure
      if (!data.token || !data.username) {
        console.error('Invalid login response structure:', data)
        throw new Error('Invalid response format: missing required fields')
      }

      this.setToken(data.token)
      
      if (DEBUG_CONFIG.LOG_API_CALLS) {
        console.log('✅ Login Success:', {
          username: data.username,
          userId: data.user_id
        })
      }
      
      return data
    } catch (error) {
      // Enhanced error handling with more details
      if (DEBUG_CONFIG.ENABLED) {
        console.error('💥 Login Request Failed:', {
          error: error instanceof Error ? error.message : String(error),
          errorType: error?.constructor?.name || typeof error,
          url: `${this.baseUrl}/api/login`,
          baseUrl: this.baseUrl,
          credentials: { username: credentials.username }
        })
      }
      
      // Re-throw with more context if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to server at ${this.baseUrl}. Please check if the backend server is running.`)
      }
      
      // Ensure we always throw an Error instance
      if (error instanceof Error) {
        throw error
      } else {
        throw new Error(`Unexpected error: ${String(error)}`)
      }
    }
  }

  async getProfile(): Promise<LoginResponse> {
    return this.requestWithRetry<LoginResponse>('/api/profile', {}, 15000, 2) // 15s timeout, 2 retries
  }

  async dashboard(): Promise<any> {
    return this.request('/api/dashboard')
  }

  async refreshToken(): Promise<Record<string, any>> {
    const data = await this.request<Record<string, any>>('/api/refresh-token', {
      method: 'POST',
    })
    if (data.token) {
      this.setToken(data.token)
    }
    return data
  }

  async logout(): Promise<void> {
    try {
      await this.request('/api/logout', { method: 'POST' })
    } finally {
      this.setToken(null)
    }
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    return this.request('/api/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async verifyResetToken(token: string): Promise<{ valid: boolean }> {
    return this.request(`/api/verify-reset-token/${token}`)
  }

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    return this.request('/api/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // === PARTNERS ===
  async getPartners(): Promise<PartnerSchema[]> {
    return this.request<PartnerSchema[]>('/api/partners')
  }

  async getPartner(partnerId: number): Promise<PartnerSchema> {
    return this.request<PartnerSchema>(`/api/partners/${partnerId}`)
  }

  async createPartner(data: PartnerCreateSchema): Promise<PartnerSchema> {
    return this.request<PartnerSchema>('/api/partners', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updatePartner(partnerId: number, data: PartnerUpdateSchema): Promise<PartnerSchema> {
    return this.request<PartnerSchema>(`/api/partners/${partnerId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deletePartner(partnerId: number): Promise<Record<string, any>> {
    return this.request<Record<string, any>>(`/api/partners/${partnerId}`, {
      method: 'DELETE',
    })
  }

  // === RADIO ===
  async getRadioStabs(): Promise<RadioStabSchema[]> {
    return this.request<RadioStabSchema[]>('/api/radio-stabs')
  }

  async createRadioStab(data: RadioStabCreateSchema): Promise<RadioStabSchema> {
    return this.request<RadioStabSchema>('/api/radio-stabs', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getRadioSessions(startDate?: string, endDate?: string): Promise<RadioSessionSchema[]> {
    const params = new URLSearchParams()
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request<RadioSessionSchema[]>(`/api/radio-sessions${query}`)
  }

  async createRadioSession(data: RadioSessionCreateSchema): Promise<RadioSessionSchema> {
    return this.request<RadioSessionSchema>('/api/radio-sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // === USERS ===
  async getAllUsers(): Promise<UserProfileSchema[]> {
    return this.request<UserProfileSchema[]>('/api/users')
  }

  async getUserDetails(userId: number): Promise<UserProfileSchema> {
    return this.request<UserProfileSchema>(`/api/users/${userId}`)
  }

  async getRadioStudents(): Promise<UserProfileSchema[]> {
    return this.request<UserProfileSchema[]>('/api/users/radio-students')
  }

  async checkUserAvailability(
    userId: number,
    startDatetime: string,
    endDatetime: string
  ): Promise<Record<string, any>> {
    const params = new URLSearchParams({
      start_datetime: startDatetime,
      end_datetime: endDatetime,
    })
    return this.request<Record<string, any>>(`/api/users/${userId}/availability?${params.toString()}`)
  }

  // === USER MANAGEMENT ===
  async getAllUsersDetailed(userType?: string, osztalyId?: number): Promise<UserDetailSchema[]> {
    const params = new URLSearchParams()
    if (userType) params.append('user_type', userType)
    if (osztalyId) params.append('osztaly_id', osztalyId.toString())
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request<UserDetailSchema[]>(`/api/manage/users${query}`)
  }

  async createUser(data: UserCreateSchema): Promise<UserDetailSchema> {
    return this.request<UserDetailSchema>('/api/manage/users', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateUser(userId: number, data: UserUpdateSchema): Promise<UserDetailSchema> {
    return this.request<UserDetailSchema>(`/api/manage/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteUser(userId: number): Promise<Record<string, any>> {
    return this.request<Record<string, any>>(`/api/manage/users/${userId}`, {
      method: 'DELETE',
    })
  }

  async generateUserFirstLoginToken(userId: number): Promise<FirstLoginTokenResponse> {
    return this.request<FirstLoginTokenResponse>(`/api/manage/users/${userId}/generate-first-login-token`, {
      method: 'POST',
    })
  }

  async createBulkStudents(data: BulkStudentCreateSchema): Promise<BulkEmailResponse> {
    return this.request<BulkEmailResponse>('/api/manage/users/bulk-students', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async verifyFirstLoginToken(token: string): Promise<Record<string, any>> {
    return this.request<Record<string, any>>(`/api/first-login/verify-token?token=${encodeURIComponent(token)}`, {
      method: 'POST',
    })
  }

  async setFirstPassword(token: string, password: string, confirmPassword: string): Promise<Record<string, any>> {
    const params = new URLSearchParams({
      token,
      password,
      confirm_password: confirmPassword,
    })
    return this.request<Record<string, any>>(`/api/first-login/set-password?${params.toString()}`, {
      method: 'POST',
    })
  }

  // === ACADEMIC ===
  async getSchoolYears(): Promise<TanevSchema[]> {
    return this.request<TanevSchema[]>('/api/school-years')
  }

  async getSchoolYear(tanevId: number): Promise<TanevSchema> {
    return this.request<TanevSchema>(`/api/school-years/${tanevId}`)
  }

  async createSchoolYear(data: TanevCreateSchema): Promise<TanevSchema> {
    return this.request<TanevSchema>('/api/school-years', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getActiveSchoolYear(): Promise<TanevSchema> {
    return this.request<TanevSchema>('/api/school-years/active')
  }

  async getClasses(): Promise<OsztalySchema[]> {
    return this.request<OsztalySchema[]>('/api/classes')
  }

  async getClass(osztalyId: number): Promise<OsztalySchema> {
    return this.request<OsztalySchema>(`/api/classes/${osztalyId}`)
  }

  async createClass(data: OsztalyCreateSchema): Promise<OsztalySchema> {
    return this.request<OsztalySchema>('/api/classes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateClass(osztalyId: number, data: OsztalyUpdateSchema): Promise<OsztalySchema> {
    return this.request<OsztalySchema>(`/api/classes/${osztalyId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteClass(osztalyId: number): Promise<Record<string, any>> {
    return this.request<Record<string, any>>(`/api/classes/${osztalyId}`, {
      method: 'DELETE',
    })
  }

  async getClassesBySection(szekcio: string): Promise<OsztalySchema[]> {
    return this.request<OsztalySchema[]>(`/api/classes/by-section/${encodeURIComponent(szekcio)}`)
  }

  // === EQUIPMENT ===
  async getEquipmentTypes(): Promise<EquipmentTipusSchema[]> {
    return this.request<EquipmentTipusSchema[]>('/api/equipment-types')
  }

  async createEquipmentType(data: EquipmentTipusCreateSchema): Promise<EquipmentTipusSchema> {
    return this.request<EquipmentTipusSchema>('/api/equipment-types', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getEquipment(functionalOnly?: boolean): Promise<EquipmentSchema[]> {
    const params = functionalOnly ? '?functional_only=true' : ''
    return this.request<EquipmentSchema[]>(`/api/equipment${params}`)
  }

  async getEquipmentDetails(equipmentId: number): Promise<EquipmentSchema> {
    return this.request<EquipmentSchema>(`/api/equipment/${equipmentId}`)
  }

  async createEquipment(data: EquipmentCreateSchema): Promise<EquipmentSchema> {
    return this.request<EquipmentSchema>('/api/equipment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateEquipment(equipmentId: number, data: EquipmentUpdateSchema): Promise<EquipmentSchema> {
    return this.request<EquipmentSchema>(`/api/equipment/${equipmentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteEquipment(equipmentId: number): Promise<Record<string, any>> {
    return this.request<Record<string, any>>(`/api/equipment/${equipmentId}`, {
      method: 'DELETE',
    })
  }

  async getEquipmentByType(typeId: number, functionalOnly?: boolean): Promise<EquipmentSchema[]> {
    const params = functionalOnly ? '?functional_only=true' : ''
    return this.request<EquipmentSchema[]>(`/api/equipment/by-type/${typeId}${params}`)
  }

  async checkEquipmentAvailability(
    equipmentId: number,
    startDatetime: string,
    endDatetime: string
  ): Promise<EquipmentAvailabilitySchema> {
    const params = new URLSearchParams({
      start_datetime: startDatetime,
      end_datetime: endDatetime,
    })
    return this.request<EquipmentAvailabilitySchema>(`/api/equipment/${equipmentId}/availability?${params.toString()}`)
  }

  async getEquipmentSchedule(
    equipmentId: number,
    startDate: string,
    endDate?: string
  ): Promise<EquipmentScheduleSchema> {
    const params = new URLSearchParams({ start_date: startDate })
    if (endDate) params.append('end_date', endDate)
    return this.request<EquipmentScheduleSchema>(`/api/equipment/${equipmentId}/schedule?${params.toString()}`)
  }

  async getEquipmentUsage(
    equipmentId: number,
    daysBack: number = 30
  ): Promise<EquipmentUsageSchema> {
    const params = new URLSearchParams({ days_back: daysBack.toString() })
    return this.request<EquipmentUsageSchema>(`/api/equipment/${equipmentId}/usage?${params.toString()}`)
  }

  async getEquipmentOverview(
    date: string,
    typeId?: number
  ): Promise<EquipmentOverviewSchema[]> {
    const params = new URLSearchParams({ date })
    if (typeId) params.append('type_id', typeId.toString())
    return this.request<EquipmentOverviewSchema[]>(`/api/equipment/availability-overview?${params.toString()}`)
  }

  // === PRODUCTION ===
  async getContactPersons(): Promise<ContactPersonSchema[]> {
    return this.request<ContactPersonSchema[]>('/api/contact-persons')
  }

  async createContactPerson(data: ContactPersonCreateSchema): Promise<ContactPersonSchema> {
    return this.request<ContactPersonSchema>('/api/contact-persons', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getFilmingSessions(startDate?: string, endDate?: string, type?: string): Promise<ForgatSchema[]> {
    const params = new URLSearchParams()
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)
    if (type) params.append('type', type)
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request<ForgatSchema[]>(`/api/filming-sessions${query}`)
  }

  async getFilmingSession(forgatId: number): Promise<ForgatSchema> {
    return this.request<ForgatSchema>(`/api/filming-sessions/${forgatId}`)
  }

  async createFilmingSession(data: ForgatCreateSchema): Promise<ForgatSchema> {
    return this.request<ForgatSchema>('/api/filming-sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateFilmingSession(forgatId: number, data: ForgatUpdateSchema): Promise<ForgatSchema> {
    return this.request<ForgatSchema>(`/api/filming-sessions/${forgatId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteFilmingSession(forgatId: number): Promise<Record<string, any>> {
    return this.request<Record<string, any>>(`/api/filming-sessions/${forgatId}`, {
      method: 'DELETE',
    })
  }

  async getFilmingTypes(): Promise<ForgatoTipusSchema[]> {
    return this.request<ForgatoTipusSchema[]>('/api/filming-sessions/types')
  }

  // === COMMUNICATIONS ===
  async getAnnouncements(myAnnouncements = false): Promise<AnnouncementSchema[]> {
    const params = myAnnouncements ? '?my_announcements=true' : ''
    return this.request<AnnouncementSchema[]>(`/api/announcements${params}`)
  }

  async getPublicAnnouncements(): Promise<AnnouncementSchema[]> {
    return this.request<AnnouncementSchema[]>('/api/announcements/public')
  }

  async getAnnouncementDetails(announcementId: number): Promise<AnnouncementDetailSchema> {
    return this.request<AnnouncementDetailSchema>(`/api/announcements/${announcementId}`)
  }

  async createAnnouncement(data: AnnouncementCreateSchema): Promise<AnnouncementDetailSchema> {
    return this.request<AnnouncementDetailSchema>('/api/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateAnnouncement(announcementId: number, data: AnnouncementUpdateSchema): Promise<AnnouncementDetailSchema> {
    return this.request<AnnouncementDetailSchema>(`/api/announcements/${announcementId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteAnnouncement(announcementId: number): Promise<Record<string, any>> {
    return this.request<Record<string, any>>(`/api/announcements/${announcementId}`, {
      method: 'DELETE',
    })
  }

  async getAnnouncementRecipients(announcementId: number): Promise<UserBasicSchema[]> {
    return this.request<UserBasicSchema[]>(`/api/announcements/${announcementId}/recipients`)
  }

  // === ORGANIZATION ===
  async getStabs(): Promise<StabSchema[]> {
    return this.request<StabSchema[]>('/api/stabs')
  }

  async createStab(data: StabCreateSchema): Promise<StabSchema> {
    return this.request<StabSchema>('/api/stabs', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getRoles(year?: number): Promise<SzerepkorSchema[]> {
    const params = year ? `?year=${year}` : ''
    return this.request<SzerepkorSchema[]>(`/api/roles${params}`)
  }

  async createRole(data: SzerepkorCreateSchema): Promise<SzerepkorSchema> {
    return this.request<SzerepkorSchema>('/api/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getRoleRelations(userId?: number, roleId?: number): Promise<SzerepkorRelacioSchema[]> {
    const params = new URLSearchParams()
    if (userId) params.append('user_id', userId.toString())
    if (roleId) params.append('role_id', roleId.toString())
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request<SzerepkorRelacioSchema[]>(`/api/role-relations${query}`)
  }

  async createRoleRelation(data: SzerepkorRelacioCreateSchema): Promise<SzerepkorRelacioSchema> {
    return this.request<SzerepkorRelacioSchema>('/api/role-relations', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteRoleRelation(relationId: number): Promise<Record<string, any>> {
    return this.request<Record<string, any>>(`/api/role-relations/${relationId}`, {
      method: 'DELETE',
    })
  }

  async getAssignments(tanevId?: number, kesz?: boolean): Promise<BeosztasSchema[]> {
    const params = new URLSearchParams()
    if (tanevId) params.append('tanev_id', tanevId.toString())
    if (kesz !== undefined) params.append('kesz', kesz.toString())
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request<BeosztasSchema[]>(`/api/assignments${query}`)
  }

  async getAssignmentDetails(assignmentId: number): Promise<BeosztasDetailSchema> {
    return this.request<BeosztasDetailSchema>(`/api/assignments/${assignmentId}`)
  }

  async createAssignment(data: BeosztasCreateSchema): Promise<BeosztasDetailSchema> {
    return this.request<BeosztasDetailSchema>('/api/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteAssignment(assignmentId: number): Promise<Record<string, any>> {
    return this.request<Record<string, any>>(`/api/assignments/${assignmentId}`, {
      method: 'DELETE',
    })
  }

  async toggleAssignmentCompletion(assignmentId: number): Promise<BeosztasDetailSchema> {
    return this.request<BeosztasDetailSchema>(`/api/assignments/${assignmentId}/toggle-complete`, {
      method: 'PUT',
    })
  }

  // === ABSENCE ===
  async getAbsences(
    userId?: number,
    startDate?: string,
    endDate?: string,
    myAbsences = false
  ): Promise<TavolletSchema[]> {
    const params = new URLSearchParams()
    if (userId) params.append('user_id', userId.toString())
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)
    if (myAbsences) params.append('my_absences', 'true')
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request<TavolletSchema[]>(`/api/absences${query}`)
  }

  async getAbsenceDetails(absenceId: number): Promise<TavolletSchema> {
    return this.request<TavolletSchema>(`/api/absences/${absenceId}`)
  }

  async createAbsence(data: TavolletCreateSchema): Promise<TavolletSchema> {
    return this.request<TavolletSchema>('/api/absences', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateAbsence(absenceId: number, data: TavolletUpdateSchema): Promise<TavolletSchema> {
    return this.request<TavolletSchema>(`/api/absences/${absenceId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteAbsence(absenceId: number): Promise<Record<string, any>> {
    return this.request<Record<string, any>>(`/api/absences/${absenceId}`, {
      method: 'DELETE',
    })
  }

  async approveAbsence(absenceId: number): Promise<TavolletSchema> {
    return this.request<TavolletSchema>(`/api/absences/${absenceId}/approve`, {
      method: 'PUT',
    })
  }

  async denyAbsence(absenceId: number): Promise<TavolletSchema> {
    return this.request<TavolletSchema>(`/api/absences/${absenceId}/deny`, {
      method: 'PUT',
    })
  }

  async checkUserAbsenceConflicts(
    userId: number,
    startDate: string,
    endDate: string
  ): Promise<Record<string, any>> {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    })
    return this.request<Record<string, any>>(`/api/absences/user/${userId}/conflicts?${params.toString()}`)
  }

  // === CONFIGURATION ===
  async getConfigurations(): Promise<ConfigSchema[]> {
    return this.request<ConfigSchema[]>('/api/config')
  }

  async getConfiguration(configId: number): Promise<ConfigSchema> {
    return this.request<ConfigSchema>(`/api/config/${configId}`)
  }

  async createConfiguration(data: ConfigUpdateSchema): Promise<ConfigSchema> {
    return this.request<ConfigSchema>('/api/config', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateConfiguration(configId: number, data: ConfigUpdateSchema): Promise<ConfigSchema> {
    return this.request<ConfigSchema>(`/api/config/${configId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteConfiguration(configId: number): Promise<Record<string, any>> {
    return this.request<Record<string, any>>(`/api/config/${configId}`, {
      method: 'DELETE',
    })
  }

  async getCurrentConfiguration(): Promise<ConfigSchema> {
    return this.request<ConfigSchema>('/api/config/current')
  }

  async updateCurrentConfiguration(data: ConfigUpdateSchema): Promise<ConfigSchema> {
    return this.request<ConfigSchema>('/api/config/current', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async toggleConfigurationActive(configId: number): Promise<ConfigSchema> {
    return this.request<ConfigSchema>(`/api/config/${configId}/toggle-active`, {
      method: 'PUT',
    })
  }

  async toggleConfigurationEmails(configId: number): Promise<ConfigSchema> {
    return this.request<ConfigSchema>(`/api/config/${configId}/toggle-emails`, {
      method: 'PUT',
    })
  }

  async getSystemStatus(): Promise<Record<string, any>> {
    return this.request<Record<string, any>>('/api/config/status')
  }

  // === UTILITY METHODS ===
  isAuthenticated(): boolean {
    // Always check fresh token from storage
    const token = this.getToken()
    return !!(token && token.trim() !== '' && token !== 'null')
  }

  getToken(): string | null {
    // Refresh token from storage if not set
    if (!this.token && typeof window !== 'undefined') {
      this.token = this.getStoredToken()
    }
    return this.token
  }

  // Force refresh token from storage
  refreshTokenFromStorage(): string | null {
    if (typeof window !== 'undefined') {
      this.token = this.getStoredToken()
    }
    return this.token
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
}

export const apiClient = new ApiClient(API_CONFIG.BASE_URL)
