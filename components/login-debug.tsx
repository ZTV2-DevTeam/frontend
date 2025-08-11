'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiClient } from '@/lib/api'
import { API_CONFIG, ENV_UTILS } from '@/lib/config'

export function LoginDebug() {
  const [username, setUsername] = useState('test')
  const [password, setPassword] = useState('test')
  const [result, setResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    setResult('Testing connection...')
    
    try {
      // Test basic connectivity
      console.log('Testing API connection to:', apiClient.getToken())
      const hello = await apiClient.hello()
      console.log('Hello response:', hello)
      setResult(prev => prev + '\n✅ Backend connection: ' + JSON.stringify(hello))
      
      // Test auth endpoint
      try {
        const authTest = await apiClient.testAuth()
        setResult(prev => prev + '\n✅ Auth test: ' + JSON.stringify(authTest))
      } catch (authError) {
        setResult(prev => prev + '\n⚠️ Auth test (expected to fail): ' + (authError instanceof Error ? authError.message : String(authError)))
      }
      
      // Test login endpoint specifically
      try {
        const loginResult = await apiClient.login({ username, password })
        console.log('Login success:', loginResult)
        setResult(prev => prev + '\n✅ Login successful: ' + JSON.stringify({
          username: loginResult.username,
          userId: loginResult.user_id
        }))
      } catch (loginError) {
        console.error('Login error:', loginError)
        setResult(prev => prev + '\n❌ Login error: ' + (loginError instanceof Error ? loginError.message : String(loginError)))
      }
      
    } catch (error) {
      console.error('Connection error:', error)
      setResult(prev => prev + '\n❌ Connection error: ' + (error instanceof Error ? error.message : String(error)))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold">Login Debug Panel</h3>
      
      {/* Configuration Info */}
      <div className="text-xs text-gray-600 bg-white p-2 rounded">
        <div><strong>Environment:</strong> {ENV_UTILS.getCurrentEnvironment()}</div>
        <div><strong>API URL:</strong> {ENV_UTILS.getApiUrl()}</div>
        <div><strong>Debug:</strong> {API_CONFIG.DEBUG ? 'Enabled' : 'Disabled'}</div>
        <div><strong>Current Token:</strong> {apiClient.getToken() ? 'Present' : 'None'}</div>
      </div>
      
      <div className="space-y-2">
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      
      <Button onClick={testConnection} disabled={isLoading}>
        {isLoading ? 'Testing...' : 'Test Login Connection'}
      </Button>
      
      {result && (
        <pre className="p-2 bg-white rounded text-sm whitespace-pre-wrap border">
          {result}
        </pre>
      )}
    </div>
  )
}
