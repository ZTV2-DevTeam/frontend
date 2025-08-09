// Configuration for your API
// Update this with your actual API endpoint
export const API_CONFIG = {
  // Development API URL
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  
  // Production API URL - update this when deploying
  // BASE_URL: 'https://your-api-domain.com',
  
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
  // Backend URL for Django admin and API
  BASE_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
  
  // Django admin base path
  ADMIN_BASE_PATH: '/admin',
  
  // Get full admin URL for a model path
  getAdminUrl: (modelPath: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    return `${baseUrl}/admin/${modelPath}/`;
  }
}

// You can also set the API URL via environment variables:
// Create a .env.local file with:
// NEXT_PUBLIC_API_URL=http://your-api-server:port
