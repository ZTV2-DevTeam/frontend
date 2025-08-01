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

// You can also set the API URL via environment variables:
// Create a .env.local file with:
// NEXT_PUBLIC_API_URL=http://your-api-server:port
