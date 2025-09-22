'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useErrorToast } from '@/contexts/error-toast-context'
import { GlobalErrorBoundary } from '@/components/global-error-boundary'
import { Bug, Wifi, Shield, Clock, AlertTriangle } from 'lucide-react'

// Component that throws a React error
function ErrorThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test React Component Error: This is a deliberate error for testing')
  }
  return <div className="p-4 bg-green-100 rounded-lg">✅ Component rendered successfully!</div>
}

// Component that throws different types of errors
function NetworkErrorComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Network Error: Failed to fetch data from server')
  }
  return <div className="p-4 bg-green-100 rounded-lg">✅ Network component rendered successfully!</div>
}

function PermissionErrorComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Permission Error: Unauthorized access to resource')
  }
  return <div className="p-4 bg-green-100 rounded-lg">✅ Permission component rendered successfully!</div>
}

export function ErrorHandlingTest() {
  const [reactError, setReactError] = useState(false)
  const [networkError, setNetworkError] = useState(false)
  const [permissionError, setPermissionError] = useState(false)
  const { 
    showErrorToast, 
    showNetworkErrorToast, 
    showPermissionErrorToast, 
    showTimeoutErrorToast,
    showGenericErrorToast 
  } = useErrorToast()

  // Test JavaScript errors (not React errors)
  const triggerJavaScriptError = () => {
    // This will be caught by the global error handler
    setTimeout(() => {
      throw new Error('Test JavaScript Error: This is a deliberate JS error')
    }, 100)
  }

  const triggerPromiseRejection = () => {
    // This will be caught by the unhandled rejection handler
    Promise.reject(new Error('Test Promise Rejection: This is a deliberate promise rejection'))
  }

  const triggerNetworkPromiseRejection = () => {
    Promise.reject(new Error('Network Error: Failed to fetch data'))
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Error Handling Test Suite
          </CardTitle>
          <CardDescription>
            Test different types of errors and verify that appropriate toasts are shown.
            Open browser DevTools to see console logs.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Manual Toast Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Manual Toast Tests</CardTitle>
          <CardDescription>
            Test error toasts directly without throwing actual errors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button 
              variant="destructive" 
              onClick={() => showNetworkErrorToast()}
              className="flex items-center gap-2"
            >
              <Wifi className="h-4 w-4" />
              Network Error Toast
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={() => showPermissionErrorToast()}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Permission Error Toast
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={() => showTimeoutErrorToast()}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Timeout Error Toast
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={() => showGenericErrorToast()}
              className="flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Generic Error Toast
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={() => showErrorToast(new Error('Custom error message for testing'), {
                description: 'This is a custom error description',
                action: {
                  label: 'Custom Action',
                  onClick: () => alert('Custom action clicked!')
                }
              })}
              className="flex items-center gap-2"
            >
              <Bug className="h-4 w-4" />
              Custom Error Toast
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* JavaScript Error Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">JavaScript Error Tests</CardTitle>
          <CardDescription>
            Test uncaught JavaScript errors and promise rejections (handled by GlobalErrorHandler)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button 
              variant="outline"
              onClick={triggerJavaScriptError}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              Trigger JS Error
            </Button>
            
            <Button 
              variant="outline"
              onClick={triggerPromiseRejection}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              Trigger Promise Rejection
            </Button>
            
            <Button 
              variant="outline"
              onClick={triggerNetworkPromiseRejection}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              Trigger Network Promise Rejection
            </Button>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-800">
              <strong>Note:</strong> These errors will be caught by the global error handler and show appropriate toasts.
              Check the browser console for detailed logs.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* React Error Boundary Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">React Error Boundary Tests</CardTitle>
          <CardDescription>
            Test React component errors caught by error boundaries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Generic React Error */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Generic React Error</h4>
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  variant={reactError ? "destructive" : "default"}
                  onClick={() => setReactError(!reactError)}
                >
                  {reactError ? 'Reset' : 'Trigger Error'}
                </Button>
                <Badge variant={reactError ? "destructive" : "secondary"}>
                  {reactError ? 'Error State' : 'Normal State'}
                </Badge>
              </div>
            </div>
            
            <GlobalErrorBoundary level="component">
              <ErrorThrowingComponent shouldThrow={reactError} />
            </GlobalErrorBoundary>
          </div>

          <Separator />

          {/* Network Error */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Network Error (React)</h4>
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  variant={networkError ? "destructive" : "default"}
                  onClick={() => setNetworkError(!networkError)}
                >
                  {networkError ? 'Reset' : 'Trigger Network Error'}
                </Button>
                <Badge variant={networkError ? "destructive" : "secondary"}>
                  {networkError ? 'Error State' : 'Normal State'}
                </Badge>
              </div>
            </div>
            
            <GlobalErrorBoundary level="component">
              <NetworkErrorComponent shouldThrow={networkError} />
            </GlobalErrorBoundary>
          </div>

          <Separator />

          {/* Permission Error */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Permission Error (React)</h4>
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  variant={permissionError ? "destructive" : "default"}
                  onClick={() => setPermissionError(!permissionError)}
                >
                  {permissionError ? 'Reset' : 'Trigger Permission Error'}
                </Button>
                <Badge variant={permissionError ? "destructive" : "secondary"}>
                  {permissionError ? 'Error State' : 'Normal State'}
                </Badge>
              </div>
            </div>
            
            <GlobalErrorBoundary level="component">
              <PermissionErrorComponent shouldThrow={permissionError} />
            </GlobalErrorBoundary>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium">What to expect:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li><strong>Manual Toast Tests:</strong> Should show appropriate error toasts immediately</li>
              <li><strong>JavaScript Error Tests:</strong> Should show error toasts after ~100ms delay</li>
              <li><strong>React Error Tests:</strong> Should show both error boundary UI and error toasts</li>
              <li><strong>Console Logs:</strong> Check DevTools for detailed error information</li>
              <li><strong>Toast Actions:</strong> Click toast action buttons to test functionality</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Pro Tip:</strong> Open the browser DevTools (F12) before testing to see detailed error logs 
              and verify that errors are being caught and handled properly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}