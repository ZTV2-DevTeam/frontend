'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function DebugFilmingSessions() {
  const { isAuthenticated, user } = useAuth()
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const testApiCall = async () => {
    setLoading(true)
    const result: any = {}
    
    try {
      // Test authentication status
      result.isAuthenticated = isAuthenticated
      result.hasToken = !!apiClient.getToken()
      result.tokenLength = apiClient.getToken()?.length || 0
      result.user = user
      
      // Test basic API call
      try {
        const testAuth = await apiClient.testAuth()
        result.testAuth = testAuth
      } catch (error) {
        result.testAuthError = error instanceof Error ? error.message : String(error)
      }
      
      // Test filming sessions API call
      try {
        console.log('Testing filming sessions API...')
        const filmingSessions = await apiClient.getFilmingSessions()
        result.filmingSessions = filmingSessions
        result.filmingSessionsCount = Array.isArray(filmingSessions) ? filmingSessions.length : 'not an array'
      } catch (error) {
        result.filmingSessionsError = error instanceof Error ? error.message : String(error)
        console.error('Filming sessions error:', error)
      }
      
      // Test permissions
      try {
        const permissions = await apiClient.getPermissions()
        result.permissions = permissions
      } catch (error) {
        result.permissionsError = error instanceof Error ? error.message : String(error)
      }
      
    } catch (error) {
      result.generalError = error instanceof Error ? error.message : String(error)
    }
    
    setDebugInfo(result)
    setLoading(false)
  }

  useEffect(() => {
    if (isAuthenticated) {
      testApiCall()
    }
  }, [isAuthenticated])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Debug: Filming Sessions API</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testApiCall} disabled={loading}>
          {loading ? 'Testing...' : 'Test API Calls'}
        </Button>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Debug Information:</h3>
          <pre className="text-sm overflow-auto whitespace-pre-wrap">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div className="text-sm text-gray-600">
          <p><strong>Auth Status:</strong> {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
          <p><strong>User:</strong> {user ? `${user.first_name} ${user.last_name} (${user.username})` : 'No user'}</p>
          <p><strong>Token:</strong> {apiClient.getToken() ? 'Present' : 'Missing'}</p>
        </div>
      </CardContent>
    </Card>
  )
}
