'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { apiClient } from '@/lib/api'

export function ApiTestComponent() {
    const [testResults, setTestResults] = useState<{
        hello?: string
        testAuth?: string
        error?: string
    }>({})
    const [isLoading, setIsLoading] = useState(false)

    const testApiConnection = async () => {
        setIsLoading(true)
        setTestResults({})

        try {
            // Test basic API connectivity
            const response = await fetch(`${apiClient['baseUrl']}/api/hello?name=ZTV2`)
            
            if (response.ok) {
                const data = await response.text()
                setTestResults(prev => ({ ...prev, hello: data }))
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            // Test auth endpoint
            try {
                await apiClient.testAuth()
                setTestResults(prev => ({ ...prev, testAuth: 'Auth endpoint accessible' }))
            } catch (error) {
                setTestResults(prev => ({ 
                    ...prev, 
                    testAuth: `Auth endpoint error: ${error instanceof Error ? error.message : 'Unknown error'}` 
                }))
            }

        } catch (error) {
            setTestResults({
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-2xl bg-background border-border">
            <CardHeader>
                <CardTitle className="text-primary">API Connection Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button onClick={testApiConnection} disabled={isLoading}>
                    {isLoading ? 'Testing...' : 'Test API Connection'}
                </Button>
                
                {testResults.hello && (
                    <div className="p-3 border border-green-200 rounded bg-green-50 dark:bg-green-900/30 dark:border-green-700 text-primary">
                        <strong>Hello Endpoint:</strong> {testResults.hello}
                    </div>
                )}
                
                {testResults.testAuth && (
                    <div className="p-3 border border-blue-200 rounded bg-blue-50 dark:bg-blue-900/30 dark:border-blue-700 text-primary">
                        <strong>Test Auth Endpoint:</strong> {testResults.testAuth}
                    </div>
                )}
                
                {testResults.error && (
                    <div className="p-3 border border-red-200 rounded bg-red-50 dark:bg-red-900/30 dark:border-red-700 text-primary">
                        <strong>Error:</strong> {testResults.error}
                    </div>
                )}
                
                <div className="text-sm text-muted-foreground">
                    <p><strong>API URL:</strong> <span className="text-primary">{apiClient['baseUrl']}</span></p>
                    <p>Make sure your backend server is running on this URL.</p>
                </div>
            </CardContent>
        </Card>
    )
}
