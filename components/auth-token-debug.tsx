'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'

export function AuthTokenDebug() {
  const { user, isAuthenticated } = useAuth()
  const [testResult, setTestResult] = useState<string>('')

  const testAuthToken = async () => {
    try {
      setTestResult('Testing...')
      
      // Get token info
      const token = apiClient.getToken()
      const isAuth = apiClient.isAuthenticated()
      
      // Also check localStorage directly
      const localStorageToken = localStorage.getItem('jwt_token')
      const cookieToken = document.cookie
        .split(';')
        .find(cookie => cookie.trim().startsWith('jwt_token='))
        ?.split('=')[1]
      
      console.log('🔍 Auth Debug:', {
        apiClientToken: token ? `${token.substring(0, 30)}...` : 'NONE',
        localStorageToken: localStorageToken ? `${localStorageToken.substring(0, 30)}...` : 'NONE',
        cookieToken: cookieToken ? `${cookieToken.substring(0, 30)}...` : 'NONE',
        isAuthenticated: isAuth,
        user: user?.username
      })

      // Try to make a simple authenticated request
      const partners = await apiClient.getPartners()
      
      setTestResult(`✅ Success! Got ${partners?.length || 0} partners. Token is working.`)
      
    } catch (error) {
      console.error('Auth test failed:', error)
      setTestResult(`❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const testCreateForgatás = async () => {
    try {
      setTestResult('Testing forgatás creation...')
      
      const testData = {
        name: "Test Forgatás",
        description: "Test description",
        date: "2025-08-20",
        time_from: "10:00:00",
        time_to: "12:00:00",
        type: "ESEMENY",
        location_id: 1,
        contact_person_id: 1,
        notes: "Test notes",
        equipment_ids: []
      }
      
      console.log('🎬 Testing forgatás creation with data:', testData)
      
      const result = await apiClient.createFilmingSession(testData)
      setTestResult(`✅ Forgatás created successfully! ID: ${result.id}`)
      
    } catch (error) {
      console.error('Forgatás creation test failed:', error)
      setTestResult(`❌ Forgatás creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Auth Debug</CardTitle>
          <CardDescription>Not authenticated</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Auth Token Debug</CardTitle>
        <CardDescription>Test authentication and API calls</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm">User: {user?.username}</p>
          <p className="text-sm">Auth State: {isAuthenticated ? '✅ Authenticated' : '❌ Not authenticated'}</p>
        </div>
        
        <div className="space-y-2">
          <Button onClick={testAuthToken} className="w-full">
            Test Auth Token
          </Button>
          <Button onClick={testCreateForgatás} className="w-full" variant="outline">
            Test Create Forgatás
          </Button>
        </div>
        
        {testResult && (
          <div className="p-3 bg-muted rounded text-sm">
            {testResult}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
