// Configuration for your API with environment-specific settings
// This automatically detects the environment and uses appropriate backend URLs

// Environment detection
const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = process.env.NODE_ENV === 'development'
const isStaging = process.env.NEXT_PUBLIC_NODE_ENV === 'staging'

// Environment-specific defaults
const getEnvironmentDefaults = () => {
  if (isStaging) {
    return {
      API_URL: 'https://api-staging.szlg.info',
      BACKEND_URL: 'https://api-staging.szlg.info',
      CONTACT_EMAIL: 'staging@szlgbp.hu',
      ORG_NAME: 'ZTV2 Staging',
      WEBSITE_URL: 'https://staging.ftv.szlg.info',
      DEBUG: true,
      LOG_LEVEL: 'info'
    }
  } else if (isProduction) {
    return {
      API_URL: 'https://ftvapi.szlg.info',
      BACKEND_URL: 'https://ftvapi.szlg.info',
      CONTACT_EMAIL: 'balla.botond.23f@szlgbp.hu',
      ORG_NAME: 'ZTV2',
      WEBSITE_URL: 'https://ftv.szlg.info',
      DEBUG: false,
      LOG_LEVEL: 'error'
    }
  } else {
    // Development defaults
    return {
      API_URL: 'http://localhost:8000',
      BACKEND_URL: 'http://localhost:8000',
      CONTACT_EMAIL: 'dev@szlgbp.hu',
      ORG_NAME: 'ZTV2 Dev',
      WEBSITE_URL: 'http://localhost:3000',
      DEBUG: true,
      LOG_LEVEL: 'debug'
    }
  }
}

const defaults = getEnvironmentDefaults()

export const API_CONFIG = {
  // API URL with environment-specific defaults
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || defaults.API_URL,
  
  // Environment info
  IS_DEVELOPMENT: isDevelopment,
  IS_PRODUCTION: isProduction,
  IS_STAGING: isStaging,
  ENVIRONMENT: process.env.NEXT_PUBLIC_NODE_ENV || process.env.NODE_ENV || 'development',
  
  // Debug settings
  DEBUG: process.env.NEXT_PUBLIC_DEBUG === 'true' || defaults.DEBUG,
  LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL || defaults.LOG_LEVEL,
  
  // API endpoints
  ENDPOINTS: {
    LOGIN: '/api/login',
    PROFILE: '/api/profile', 
    REFRESH_TOKEN: '/api/refresh-token',
    LOGOUT: '/api/logout',
    TEST_AUTH: '/api/test-auth',
    DASHBOARD: '/api/dashboard',
  }
}

// Backend configuration for Django admin integration
export const BACKEND_CONFIG = {
  // Backend URL with environment-specific defaults
  BASE_URL: process.env.NEXT_PUBLIC_BACKEND_URL || defaults.BACKEND_URL,
  
  // Django admin base path
  ADMIN_BASE_PATH: '/admin',
  
  // Get full admin URL for a model path
  getAdminUrl: (modelPath: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || defaults.BACKEND_URL;
    return `${baseUrl}/admin/${modelPath}/`;
  }
}

// Contact information configuration with environment-specific defaults
export const CONTACT_CONFIG = {
  // Primary contact email
  PRIMARY_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL || defaults.CONTACT_EMAIL,
  
  // Developer email for technical issues
  DEVELOPER_EMAIL: process.env.NEXT_PUBLIC_DEVELOPER_EMAIL || defaults.CONTACT_EMAIL,
  
  // Support email for general inquiries
  SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || defaults.CONTACT_EMAIL,
  
  // Emergency contact for critical issues
  EMERGENCY_CONTACT: process.env.NEXT_PUBLIC_EMERGENCY_CONTACT || defaults.CONTACT_EMAIL,
  
  // Organization name
  ORG_NAME: process.env.NEXT_PUBLIC_ORG_NAME || defaults.ORG_NAME,
  
  // Website URL
  WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL || defaults.WEBSITE_URL,
}

// Environment-specific debugging and logging
export const DEBUG_CONFIG = {
  // Enable debugging
  ENABLED: API_CONFIG.DEBUG,
  
  // Log level (debug, info, warn, error)
  LOG_LEVEL: API_CONFIG.LOG_LEVEL,
  
  // Log API calls in development
  LOG_API_CALLS: API_CONFIG.IS_DEVELOPMENT || API_CONFIG.IS_STAGING,
  
  // Show detailed error messages
  DETAILED_ERRORS: API_CONFIG.IS_DEVELOPMENT,
}

// Helper functions for environment detection
export const ENV_UTILS = {
  isDevelopment: () => API_CONFIG.IS_DEVELOPMENT,
  isProduction: () => API_CONFIG.IS_PRODUCTION,
  isStaging: () => API_CONFIG.IS_STAGING,
  getCurrentEnvironment: () => API_CONFIG.ENVIRONMENT,
  getApiUrl: () => API_CONFIG.BASE_URL,
  getBackendUrl: () => BACKEND_CONFIG.BASE_URL,
}

// Configuration validation (only runs in development)
if (API_CONFIG.IS_DEVELOPMENT) {
  console.log('🔧 Environment Configuration:', {
    environment: API_CONFIG.ENVIRONMENT,
    apiUrl: API_CONFIG.BASE_URL,
    backendUrl: BACKEND_CONFIG.BASE_URL,
    debug: API_CONFIG.DEBUG,
    logLevel: API_CONFIG.LOG_LEVEL,
  })
}

// You can also set the API URL via environment variables:
// Create a .env.local file with:
// NEXT_PUBLIC_API_URL=http://your-api-server:port
