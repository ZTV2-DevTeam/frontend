// Loading Components Index
// Export all loading-related components for easy imports

export { EnhancedLoading } from './enhanced-loading'
export { SimpleLoading, SkeletonLoader, LoadingOverlay } from './simple-loading'  
export { LoadingPage } from './loading-page'
export { ForgatásokLoading, ForgatásokSkeleton } from './forgatasok-loading'

// Re-export for convenience
export { LazyWrapper, LazyCard, SimpleLazy, createLazyComponentNamed } from './lazy-loading'

// Types for loading components
export interface LoadingProps {
  isLoading: boolean
  error?: string | null
  onRetry?: () => void
  loadingText?: string
  stage?: 'auth' | 'permissions' | 'data'
  timeout?: number
}

export interface LoadingPageProps {
  variant?: 'simple' | 'enhanced' | 'splash' | 'progress'
  title?: string
  subtitle?: string
  progress?: number
  steps?: string[]
  currentStep?: number
  showLogo?: boolean
}

export interface SimpleLoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  showText?: boolean
  className?: string
  variant?: 'default' | 'minimal' | 'gradient'
}

// Loading state constants
export const LOADING_MESSAGES = {
  AUTH: 'Bejelentkezés ellenőrzése...',
  PERMISSIONS: 'Jogosultságok betöltése...',
  DATA: 'Adatok betöltése...',
  SAVING: 'Mentés...',
  LOADING: 'Betöltés...',
  CONNECTING: 'Kapcsolódás...',
  PROCESSING: 'Feldolgozás...',
} as const

export const LOADING_TIMEOUTS = {
  FAST: 5000,    // 5 seconds
  NORMAL: 15000, // 15 seconds  
  SLOW: 30000,   // 30 seconds
  VERY_SLOW: 60000, // 1 minute
} as const
