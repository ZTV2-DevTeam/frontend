// ============================================================================
// COMPREHENSIVE API TYPES BASED ON OPENAPI SPECIFICATION
// ============================================================================

/* eslint-disable @typescript-eslint/no-explicit-any */

// Core Authentication Types
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

export interface ForgotPasswordResponse {
  message: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

export interface ResetPasswordResponse {
  message: string
}

export interface VerifyTokenResponse {
  valid: boolean
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

// === USER TYPES ===
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
  absences?: TavolletSchema[] // Optional absences property
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

// === PARTNER TYPES ===
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

// Legacy Partner types (keeping for backward compatibility)
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

// === RADIO TYPES ===
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

// === ACADEMIC TYPES ===
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

// === EQUIPMENT TYPES ===
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

// Legacy Equipment types (keeping for backward compatibility)
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

// === PRODUCTION TYPES ===
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

// Legacy Forgatás types (keeping for backward compatibility)
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

// === COMMUNICATION TYPES ===
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

// === ORGANIZATION TYPES ===
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
  forgatas: ForgatSchema
  szerepkor_relaciok: SzerepkorRelacioSchema[]
  kesz: boolean
  author?: UserBasicSchema
  stab?: StabSchema | null
  created_at: string
  student_count: number
  roles_summary: { role: string, count: number }[]
}

export interface BeosztasDetailSchema extends BeosztasSchema {
  student_role_assignments: Array<{
    id: number
    user: UserProfileSchema
    szerepkor: SzerepkorSchema
  }>
  created_by: UserProfileSchema | null
  created_at: string
  updated_at: string
}

export interface BeosztasCreateSchema {
  forgatas_id: number
  student_role_pairs: { user_id: number, szerepkor_id: number }[]
  stab_id?: number
}

export interface BeosztasUpdateSchema {
  student_role_pairs?: { user_id: number, szerepkor_id: number }[]
  kesz?: boolean
  stab_id?: number
}

export interface AbsenceFromAssignmentSchema {
  id: number
  student: UserBasicSchema
  date: string
  time_from: string
  time_to: string
  excused: boolean
  unexcused: boolean
  affected_classes: string[]
}

// === LEGACY BEOSZTAS TYPES ===
export interface LegacyBeosztasItemSchema {
  id: number
  user_id: number
  role: string
}

export interface LegacyForgatBeosztasSchema {
  id: number
  name: string
  description: string
  date: string | null
  time_from: string | null
  time_to: string | null
  location: {
    id: number
    name: string
    address: string
  } | null
  contact_person: {
    id: number
    name: string
    email: string
    phone: string
  } | null
  notes: string | null
  type: string
  type_display: string
  related_kacsa: {
    id: number
    name: string
    date: string
  } | null
  equipment_ids: number[]
  equipment_count: number
  beosztas: LegacyBeosztasItemSchema[]
  tanev: {
    id: number
    display_name: string
    is_active: boolean
  } | null
}

export interface LegacyBeosztasCreateSchema {
  beosztas: number
  forgatas: number
  user: number
  role: string
}

// === ABSENCE TYPES ===
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

// === CONFIGURATION TYPES ===
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

// ============================================================================
// FRONTEND-SPECIFIC TYPES
// ============================================================================

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

// Assignment display types
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

// Form state types
export interface FormState {
  loading: boolean
  error: string | null
  success: boolean
}

// Filter types
export interface DateRangeFilter {
  startDate?: string
  endDate?: string
}

export interface UserFilter {
  userType?: 'student' | 'teacher' | 'admin'
  classId?: number
  stabId?: number
  radioStabId?: number
  isActive?: boolean
}

export interface EquipmentFilter {
  typeId?: number
  functionalOnly?: boolean
  availableOnly?: boolean
}

// Settings types
export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  language: 'hu' | 'en'
  notifications: {
    email: boolean
    push: boolean
    inApp: boolean
  }
  privacy: {
    showProfile: boolean
    showActivity: boolean
  }
}

// File upload types
export interface FileUpload {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
}

// Search types
export interface SearchResult<T> {
  items: T[]
  total: number
  query: string
  took: number
}

// Notification types
export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: string
  read: boolean
  action?: {
    label: string
    url: string
  }
}

// Theme types
export interface Theme {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    muted: string
    border: string
  }
  fonts: {
    sans: string
    mono: string
  }
  spacing: Record<string, string>
  borderRadius: Record<string, string>
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type WithId<T> = T & { id: number }
export type WithTimestamps<T> = T & {
  created_at: string
  updated_at: string
}
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// API operation types
export type CrudOperations<T, CreateT = T, UpdateT = Partial<T>> = {
  list: () => Promise<T[]>
  get: (id: number) => Promise<T>
  create: (data: CreateT) => Promise<T>
  update: (id: number, data: UpdateT) => Promise<T>
  delete: (id: number) => Promise<void>
}
