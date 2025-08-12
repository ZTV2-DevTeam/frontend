/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useAuth } from '@/contexts/auth-context'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function AuthDebug() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const checkAuth = () => {
    const token = apiClient.getToken()
    const isAuth = apiClient.isAuthenticated()
    
    // Check localStorage and cookies
    const localStorageToken = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null
    const cookieToken = typeof window !== 'undefined' ? 
      document.cookie
        .split(';')
        .find(cookie => cookie.trim().startsWith('jwt_token='))
        ?.split('=')[1] : null

    setDebugInfo({
      token: token ? `${token.substring(0, 20)}...` : 'null',
      tokenLength: token?.length || 0,
      isAuthenticated: isAuth,
      localStorageToken: localStorageToken ? `${localStorageToken.substring(0, 20)}...` : 'null',
      cookieToken: cookieToken ? `${cookieToken.substring(0, 20)}...` : 'null',
      user: user ? {
        id: user.user_id,
        username: user.username
      } : null,
      authContextLoading: isLoading,
      authContextAuthenticated: isAuthenticated
    })
  }

  const testApiCall = async () => {
    try {
      const result = await apiClient.testAuth()
      console.log('Test API call result:', result)
      alert('API call successful: ' + JSON.stringify(result))
    } catch (error) {
      console.error('Test API call failed:', error)
      alert('API call failed: ' + (error instanceof Error ? error.message : String(error)))
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Authentication Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={checkAuth}>Check Auth Status</Button>
          <Button onClick={testApiCall}>Test API Call</Button>
        </div>
        
        {debugInfo && (
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        )}
        
        <div className="text-sm space-y-2">
          <p><strong>Auth Context:</strong></p>
          <p>Loading: {String(isLoading)}</p>
          <p>Authenticated: {String(isAuthenticated)}</p>
          <p>User: {user ? `${user.username} (${user.user_id})` : 'null'}</p>
        </div>
      </CardContent>
    </Card>
  )
}
