'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'

export function ApiDebug() {
  const [testResults, setTestResults] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)

  const runTests = async () => {
    setIsLoading(true)
    const results: Record<string, any> = {}

    // Test 1: Hello endpoint
    try {
      const hello = await apiClient.get('hello')
      results.hello = { success: true, data: hello }
    } catch (error) {
      results.hello = { success: false, error: (error as Error).message }
    }

    // Test 2: Test Auth endpoint
    try {
      const testAuth = await apiClient.testAuth()
      results.testAuth = { success: true, data: testAuth }
    } catch (error) {
      results.testAuth = { success: false, error: (error as Error).message }
    }

    // Test 3: Check if user is authenticated
    results.authenticated = {
      isAuthenticated: apiClient.isAuthenticated(),
      token: apiClient.getToken() ? '[TOKEN_EXISTS]' : null
    }

    // Test 4: Try to get permissions (should fail if not authenticated)
    try {
      const permissions = await apiClient.getPermissions()
      results.permissions = { success: true, data: permissions }
    } catch (error) {
      results.permissions = { success: false, error: (error as Error).message }
    }

    // Test 5: Try to get users (should fail if not authenticated)
    try {
      const users = await apiClient.getAllUsers()
      results.users = { success: true, count: users.length }
    } catch (error) {
      results.users = { success: false, error: (error as Error).message }
    }

    // Test 6: Try to get filming sessions (should fail if not authenticated)
    try {
      const sessions = await apiClient.getFilmingSessions()
      results.filmingSessions = { success: true, count: sessions.length }
    } catch (error) {
      results.filmingSessions = { success: false, error: (error as Error).message }
    }

    setTestResults(results)
    setIsLoading(false)
  }

  const testLogin = async () => {
    const username = prompt('Username:')
    const password = prompt('Password:')
    
    if (username && password) {
      setIsLoading(true)
      try {
        const result = await apiClient.login({ username, password })
        setTestResults(prev => ({
          ...prev,
          login: { success: true, data: result }
        }))
      } catch (error) {
        setTestResults(prev => ({
          ...prev,
          login: { success: false, error: (error as Error).message }
        }))
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">API Debug Panel</h2>
      
      <div className="space-x-4 mb-6">
        <button
          onClick={runTests}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Running Tests...' : 'Run API Tests'}
        </button>
        
        <button
          onClick={testLogin}
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Login
        </button>
      </div>

      {Object.keys(testResults).length > 0 && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Test Results:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
