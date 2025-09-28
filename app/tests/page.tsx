'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { AuthDebugHelper } from "@/components/auth-debug-helper"
import { ProfessionalLoading } from "@/components/professional-loading"
import { useErrorToast } from "@/contexts/error-toast-context"
import { ConnectionIndicator } from "@/components/connection-indicator"
import { ConnectionStatus } from "@/components/connection-status"
import { 
  TestTube, 
  Shield, 
  Loader2, 
  AlertTriangle, 
  XCircle, 
  Wifi,
  Database,
  Palette,
  Zap,
  Bug,
  Activity,
  Globe,
  Settings,
  Eye,
  Bell,
  Sparkles
} from 'lucide-react'

export default function TestsPage() {
  const [loadingStates, setLoadingStates] = useState({
    enhanced: false,
    professional: false,
    enhancedWithError: false,
    professionalWithSteps: false
  })
  
  const { showErrorToast, showNetworkErrorToast, showPermissionErrorToast } = useErrorToast()

  const handleLoadingTest = (type: keyof typeof loadingStates) => {
    setLoadingStates(prev => ({ ...prev, [type]: true }))
    
    // Auto-stop after 5 seconds for demo
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [type]: false }))
    }, 5000)
  }

  const handleErrorToastTests = () => {
    // Test different types of error toasts
    showErrorToast('Ez egy általános hibüzenet teszt')
    
    setTimeout(() => {
      showNetworkErrorToast('Hálózati kapcsolat teszt hiba')
    }, 1000)
    
    setTimeout(() => {
      showPermissionErrorToast('Jogosultság teszt hiba')
    }, 2000)
  }

  const testCategories = [
    {
      id: 'auth',
      name: 'Authentication',
      icon: Shield,
      description: 'Authentication flow and token management tests',
      color: 'bg-blue-500'
    },
    {
      id: 'loading',
      name: 'Loading States',
      icon: Loader2,
      description: 'Loading components and state management tests',
      color: 'bg-purple-500'
    },
    {
      id: 'errors',
      name: 'Error Handling',
      icon: AlertTriangle,
      description: 'Error boundaries, toasts, and error state tests',
      color: 'bg-red-500'
    },
    {
      id: 'connectivity',
      name: 'Connectivity',
      icon: Wifi,
      description: 'Network status and connection indicator tests',
      color: 'bg-green-500'
    },
    {
      id: 'ui',
      name: 'UI Components',
      icon: Palette,
      description: 'Design system and component visual tests',
      color: 'bg-orange-500'
    },
    {
      id: 'performance',
      name: 'Performance',
      icon: Zap,
      description: 'Performance monitoring and optimization tests',
      color: 'bg-yellow-500'
    }
  ]

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-primary rounded-xl">
              <Bug className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Test Suite</h1>
              <p className="text-muted-foreground">Development and debugging test collection</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Activity className="h-3 w-3 mr-1" />
              {testCategories.length} test categories
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Bug className="h-3 w-3 mr-1" />
              Development mode
            </Badge>
          </div>
        </div>

        {/* Quick Test Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Tests
            </CardTitle>
            <CardDescription>
              Fast access to common debugging scenarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button 
                onClick={handleErrorToastTests}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                Error Toasts
              </Button>
              <Button 
                onClick={() => handleLoadingTest('enhanced')}
                variant="outline"
                size="sm"
                disabled={loadingStates.enhanced}
                className="flex items-center gap-2"
              >
                {loadingStates.enhanced ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                Loading Test
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Reload Page
              </Button>
              <Button 
                onClick={() => {
                  localStorage.clear()
                  sessionStorage.clear()
                  window.location.reload()
                }}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-destructive"
              >
                <XCircle className="h-4 w-4" />
                Clear Storage
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Categories */}
        <Tabs defaultValue="auth" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            {testCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-1"
              >
                <category.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Authentication Tests */}
          <TabsContent value="auth" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Authentication Tests
                </CardTitle>
                <CardDescription>
                  Debug authentication flow, token management, and login issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AuthDebugHelper />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loading Tests */}
          <TabsContent value="loading" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5" />
                  Loading State Tests
                </CardTitle>
                <CardDescription>
                  Test different loading components and their behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Enhanced Loading Tests */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Enhanced Loading Component</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      onClick={() => handleLoadingTest('enhanced')}
                      disabled={loadingStates.enhanced}
                      className="w-full"
                    >
                      {loadingStates.enhanced ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      Test Enhanced Loading
                    </Button>
                    <Button 
                      onClick={() => handleLoadingTest('enhancedWithError')}
                      disabled={loadingStates.enhancedWithError}
                      variant="outline"
                      className="w-full"
                    >
                      {loadingStates.enhancedWithError ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <AlertTriangle className="h-4 w-4 mr-2" />}
                      Test with Error State
                    </Button>
                  </div>
                  
                  {loadingStates.enhanced && (
                    <div className="border rounded-lg p-4 bg-muted/50">
                      <ProfessionalLoading
                        variant="detailed"
                        title="Testing Professional Loading"
                        subtitle="Testing the professional loading component..."
                      />
                    </div>
                  )}

                  {loadingStates.enhancedWithError && (
                    <div className="border rounded-lg p-4 bg-muted/50">
                      <div className="text-center space-y-4 py-8">
                        <div className="text-destructive text-lg font-semibold">Error State Test</div>
                        <p className="text-muted-foreground">Test error message for demonstration</p>
                        <button 
                          onClick={() => {
                            console.log('Retry clicked')
                            setLoadingStates(prev => ({ ...prev, enhancedWithError: false }))
                          }}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Professional Loading Tests */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Professional Loading Component</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      onClick={() => handleLoadingTest('professional')}
                      disabled={loadingStates.professional}
                      className="w-full"
                    >
                      {loadingStates.professional ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      Test Professional Loading
                    </Button>
                    <Button 
                      onClick={() => handleLoadingTest('professionalWithSteps')}
                      disabled={loadingStates.professionalWithSteps}
                      variant="outline"
                      className="w-full"
                    >
                      {loadingStates.professionalWithSteps ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                      Test with Steps
                    </Button>
                  </div>
                  
                  {loadingStates.professional && (
                    <div className="border rounded-lg p-4 bg-muted/50">
                      <ProfessionalLoading
                        variant="simple"
                        title="Professional Loading Test"
                        subtitle="Testing the professional loading component appearance and behavior"
                      />
                    </div>
                  )}

                  {loadingStates.professionalWithSteps && (
                    <div className="border rounded-lg p-4 bg-muted/50">
                      <ProfessionalLoading
                        variant="detailed"
                        title="Multi-step Process Test"
                        subtitle="Testing professional loading with step-by-step progress"
                        steps={[
                          "Initializing connection",
                          "Authenticating user",
                          "Loading data",
                          "Finalizing setup"
                        ]}
                        currentStep={1}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Error Handling Tests */}
          <TabsContent value="errors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Error Handling Tests
                </CardTitle>
                <CardDescription>
                  Test error boundaries, toast notifications, and error states
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => showErrorToast('General error test message')}
                    variant="outline"
                    className="w-full"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    General Error
                  </Button>
                  <Button 
                    onClick={() => showNetworkErrorToast('Network connection failed')}
                    variant="outline"
                    className="w-full"
                  >
                    <Wifi className="h-4 w-4 mr-2" />
                    Network Error
                  </Button>
                  <Button 
                    onClick={() => showPermissionErrorToast('Access denied - insufficient permissions')}
                    variant="outline"
                    className="w-full"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Permission Error
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">Error Toast Testing</h4>
                  <p className="text-sm text-muted-foreground">
                    Click the buttons above to test different types of error toast notifications. 
                    Each type has different styling and behavior patterns.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Connectivity Tests */}
          <TabsContent value="connectivity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  Connectivity Tests
                </CardTitle>
                <CardDescription>
                  Test network status indicators and connection monitoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3">Connection Indicator</h4>
                    <ConnectionIndicator />
                    <p className="text-xs text-muted-foreground mt-2">
                      Shows current API connection status
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3">Connection Status</h4>
                    <ConnectionStatus showText={true} />
                    <p className="text-xs text-muted-foreground mt-2">
                      Detailed connection information
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* UI Component Tests */}
          <TabsContent value="ui" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  UI Component Tests
                </CardTitle>
                <CardDescription>
                  Visual tests for design system components and layouts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-2">Badge Variants</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="default">Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                      <Badge variant="outline">Outline</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-2">Button Variants</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm">Default</Button>
                      <Button variant="secondary" size="sm">Secondary</Button>
                      <Button variant="outline" size="sm">Outline</Button>
                      <Button variant="ghost" size="sm">Ghost</Button>
                      <Button variant="destructive" size="sm">Destructive</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tests */}
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance Tests
                </CardTitle>
                <CardDescription>
                  Monitor performance metrics and optimization tests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-lg bg-muted/50 text-center">
                  <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="font-semibold mb-2">Performance Testing</h4>
                  <p className="text-sm text-muted-foreground">
                    Performance monitoring and optimization tests will be available here.
                    This section will include render time measurements, API response times,
                    and memory usage monitoring.
                  </p>
                  <Badge variant="outline" className="mt-3">
                    Coming Soon
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Globe className="h-4 w-4" />
                <span>Test Environment: {process.env.NODE_ENV}</span>
              </div>
              <p>
                This test suite is designed for development and debugging purposes. 
                Use these tools to verify component behavior and troubleshoot issues.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}