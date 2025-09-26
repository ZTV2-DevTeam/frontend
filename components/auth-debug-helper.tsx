'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@/contexts/auth-context'
import { apiClient } from '@/lib/api'
import { Loader2, RefreshCw, LogOut, Shield, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

interface TokenInfo {
  hasToken: boolean
  tokenLength: number
  tokenPreview: string
  profileValid: boolean
  profileData: {
    user_id: number
    username: string
    first_name: string
    last_name: string
    email: string
  } | null
  error: string | null
}

export function AuthDebugHelper() {
  const { user, isLoading, isAuthenticated, logout, refreshToken } = useAuth()
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  const checkTokenStatus = async () => {
    setIsChecking(true)
    try {
      const token = apiClient.getToken()
      const profile = await apiClient.getProfile()
      
      setTokenInfo({
        hasToken: !!token,
        tokenLength: token?.length || 0,
        tokenPreview: token ? `${token.substring(0, 15)}...` : 'No token',
        profileValid: true,
        profileData: profile,
        error: null
      })
    } catch (error) {
      const token = apiClient.getToken()
      setTokenInfo({
        hasToken: !!token,
        tokenLength: token?.length || 0,
        tokenPreview: token ? `${token.substring(0, 15)}...` : 'No token',
        profileValid: false,
        profileData: null,
        error: error instanceof Error ? error.message : String(error)
      })
    } finally {
      setIsChecking(false)
      setLastCheck(new Date())
    }
  }

  const handleRefreshToken = async () => {
    try {
      await refreshToken()
      await checkTokenStatus()
    } catch (error) {
      console.error('Token refresh failed:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const getStatusIcon = () => {
    if (isLoading || isChecking) return <Loader2 className="h-4 w-4 animate-spin" />
    if (isAuthenticated && tokenInfo?.profileValid) return <CheckCircle className="h-4 w-4 text-green-500" />
    if (tokenInfo?.hasToken && !tokenInfo?.profileValid) return <AlertCircle className="h-4 w-4 text-yellow-500" />
    return <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusText = () => {
    if (isLoading) return 'Loading...'
    if (isAuthenticated && tokenInfo?.profileValid) return 'Authenticated & Valid'
    if (tokenInfo?.hasToken && !tokenInfo?.profileValid) return 'Token Present but Invalid'
    if (tokenInfo?.hasToken === false) return 'No Token'
    return 'Unknown State'
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Authentication Debug Helper
          </CardTitle>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge variant={isAuthenticated && tokenInfo?.profileValid ? "default" : "destructive"}>
              {getStatusText()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Auth State */}
        <div className="grid grid-cols-2 gap-4 p-3 border rounded-lg">
          <div>
            <div className="text-sm font-medium">Auth Context State</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>isLoading: {isLoading ? 'true' : 'false'}</div>
              <div>isAuthenticated: {isAuthenticated ? 'true' : 'false'}</div>
              <div>user: {user ? user.username : 'null'}</div>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Token Info</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>hasToken: {tokenInfo?.hasToken ? 'true' : 'false'}</div>
              <div>tokenLength: {tokenInfo?.tokenLength || 0}</div>
              <div>profileValid: {tokenInfo?.profileValid ? 'true' : 'false'}</div>
            </div>
          </div>
        </div>

        {/* Token Details */}
        {tokenInfo && (
          <div className="p-3 border rounded-lg">
            <div className="text-sm font-medium mb-2">Token Details</div>
            <div className="text-xs space-y-1 font-mono">
              <div>Preview: {tokenInfo.tokenPreview}</div>
              {tokenInfo.error && (
                <div className="text-red-600 dark:text-red-400">
                  Error: {tokenInfo.error}
                </div>
              )}
              {tokenInfo.profileData && (
                <div className="text-green-600 dark:text-green-400">
                  Profile: {tokenInfo.profileData.username}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Last Check */}
        {lastCheck && (
          <div className="text-xs text-muted-foreground text-center">
            Last checked: {lastCheck.toLocaleTimeString()}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={checkTokenStatus} 
            disabled={isChecking}
            variant="outline"
            size="sm"
          >
            {isChecking ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Check Token
          </Button>
          
          <Button 
            onClick={handleRefreshToken} 
            disabled={isLoading || !tokenInfo?.hasToken}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Token
          </Button>
          
          <Button 
            onClick={handleLogout} 
            disabled={isLoading}
            variant="destructive"
            size="sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Quick Access URLs */}
        <div className="p-3 border rounded-lg bg-muted/50">
          <div className="text-sm font-medium mb-2">Quick Actions</div>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => window.location.href = '/login'}
              variant="ghost"
              size="sm"
            >
              Go to Login
            </Button>
            <Button 
              onClick={() => window.location.href = '/app/iranyitopult'}
              variant="ghost"
              size="sm"
            >
              Go to Dashboard
            </Button>
            <Button 
              onClick={() => {
                apiClient.setToken(null)
                window.location.reload()
              }}
              variant="ghost"
              size="sm"
              className="text-red-600"
            >
              Clear Token & Reload
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}