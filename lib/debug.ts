import { apiClient } from './api'

export class ApiDebugger {
  static async testConnection() {
    const results: Record<string, unknown> = {}

    try {
      // Test basic connection
      const response = await fetch(`${apiClient['baseUrl']}/api/hello`)
      results.hello = {
        status: response.status,
        ok: response.ok,
        data: response.ok ? await response.text() : 'Failed'
      }
    } catch (error) {
      results.hello = { error: error instanceof Error ? error.message : 'Unknown error' }
    }

    try {
      // Test auth endpoint
      await apiClient.testAuth()
      results.testAuth = { status: 'Success' }
    } catch (error) {
      results.testAuth = { error: error instanceof Error ? error.message : 'Unknown error' }
    }

    return results
  }

  static async testLogin(username: string, password: string) {
    try {
      const result = await apiClient.login({ username, password })
      return { success: true, data: result }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  static getStoredToken() {
    if (typeof window !== 'undefined') {
      return {
        localStorage: localStorage.getItem('jwt_token'),
        cookies: document.cookie.includes('jwt_token')
      }
    }
    return null
  }
}

// Usage in browser console:
// import { ApiDebugger } from '@/lib/debug'
// ApiDebugger.testConnection().then(console.log)
// ApiDebugger.testLogin('username', 'password').then(console.log)
// console.log(ApiDebugger.getStoredToken())
